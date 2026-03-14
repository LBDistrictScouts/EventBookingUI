import { getCookie, setCookie } from "typescript-cookie";
import {
    fetchRequest,
    getOriginDevLocalhost,
    getParticipantTypes,
    getBookableEvent,
    getSections,
    handleFieldError,
    getParticipantServerErrors,
    handleReferenceNumber,
    lookupEntry,
    submitCheckIn,
    storeEntry,
    getSavedEntry,
    storeEvent,
    getSavedEvent,
} from "../src/data/backend";

global.Request = jest.fn().mockImplementation((url, options) => ({
    url,
    ...options,
}));

class MockResponse {
    ok: boolean;
    status: number;
    statusText: string;
    private consumed = false;
    private body: unknown;

    constructor(body: unknown, init: { status?: number; statusText?: string; ok?: boolean } = {}) {
        this.body = body;
        this.status = init.status ?? 200;
        this.statusText = init.statusText ?? "";
        this.ok = init.ok ?? (this.status >= 200 && this.status < 300);
    }

    get bodyUsed() {
        return this.consumed;
    }

    async json() {
        this.consumed = true;
        return this.body;
    }
}

global.Response = MockResponse as any;

// Mock global fetch for API calls
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Success" }),
    })
) as jest.Mock;

beforeEach(() => {
    jest.spyOn(console, "debug").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
    jest.restoreAllMocks();
});


describe("Backend Utilities", () => {
    test("getOriginDevLocalhost normalizes localhost URLs only", () => {
        const href = window.location.href;
        const expected = href.includes("localhost") ? href.replace("http://", "https://") : href;
        expect(getOriginDevLocalhost()).toBe(expected);
    });
});

describe("fetchRequest", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
        (getCookie as jest.Mock).mockReturnValue("mocked-cookie-value");
    });

    test("fetchRequest makes a GET request and returns response", async () => {
        const mockResponse = { message: "Success" };
        (fetch as jest.Mock).mockImplementation((input: URL | string) => {
            const url = typeof input === "string" ? input : input.toString();
            if (url === "http://localhost/test-endpoint") {
                return Promise.resolve({
                    ok: true,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });
            }

            throw new Error(`Unexpected endpoint: ${url}`);
        });

        const response = await fetchRequest("/test-endpoint");
        const json = await response.json();

        const [calledUrl, calledOptions] = (fetch as jest.Mock).mock.calls[0];
        expect(calledUrl.toString()).toBe("http://localhost/test-endpoint");
        expect(calledOptions).toEqual(
            expect.objectContaining({
                method: "GET",
                mode: "cors",
                headers: expect.any(Headers),
            })
        );
        expect(calledOptions.headers.get("Origin")).toBe(getOriginDevLocalhost());
        expect(calledOptions.headers.get("X-CSRF-Token")).toBe("mocked-cookie-value");
        expect(json).toEqual(mockResponse);
    });

    test("fetchRequest makes a POST request with data", async () => {
        const mockResponse = { message: "Created" };
        (fetch as jest.Mock).mockImplementation((input: URL | string) => {
            const url = typeof input === "string" ? input : input.toString();
            if (url === "http://localhost/submit") {
                return Promise.resolve({
                    ok: true,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });
            }

            throw new Error(`Unexpected endpoint: ${url}`);
        });

        const postData = { name: "John Doe" };
        const response = await fetchRequest("/submit", "POST", postData);
        const json = await response.json();

        const [calledUrl, calledOptions] = (fetch as jest.Mock).mock.calls[0];
        expect(calledUrl.toString()).toBe("http://localhost/submit");
        expect(calledOptions).toEqual(
            expect.objectContaining({
                body: JSON.stringify({ name: "John Doe" }),
                method: "POST",
                mode: "cors",
                headers: expect.any(Headers),
            })
        );
        expect(json).toEqual(mockResponse);
    });

    test("fetchRequest returns failed response when request is unsuccessful", async () => {
        (fetch as jest.Mock).mockImplementation((input: URL | string) => {
            const url = typeof input === "string" ? input : input.toString();
            if (url === "http://localhost/fail") {
                return Promise.resolve({
                    ok: false,
                    status: 500,
                    statusText: "Internal Server Error",
                });
            }

            throw new Error(`Unexpected endpoint: ${url}`);
        });

        const response = await fetchRequest("/fail");
        expect(response.ok).toBe(false);
        expect(response.status).toBe(500);
        expect(response.statusText).toBe("Internal Server Error");
    });
});

describe("backend response processors", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("getParticipantTypes returns participant types from local endpoint", async () => {
        const participantTypes = [{ id: "pt-1", participant_type: "Beaver" }];
        (fetch as jest.Mock).mockImplementation((input: URL | string) => {
            const url = typeof input === "string" ? input : input.toString();
            if (url === "http://localhost/participant-types.json") {
                return Promise.resolve(new (global.Response as any)({ participantTypes }, { status: 200 }));
            }

            throw new Error(`Unexpected endpoint: ${url}`);
        });

        await expect(getParticipantTypes()).resolves.toEqual(participantTypes);
    });

    test("getParticipantTypes throws on unsuccessful response", async () => {
        (fetch as jest.Mock).mockResolvedValue(new (global.Response as any)({}, { status: 500 }));

        await expect(getParticipantTypes()).rejects.toThrow('"response" was not successful.');
    });

    test("getBookableEvent returns event payload from local endpoint", async () => {
        const event = { id: "evt-1", event_name: "Camp", checkpoints: [], questions: [], sections: [] };
        (fetch as jest.Mock).mockImplementation((input: URL | string) => {
            const url = typeof input === "string" ? input : input.toString();
            if (url === "http://localhost/events/current.json") {
                return Promise.resolve(new (global.Response as any)({ event }, { status: 200 }));
            }

            throw new Error(`Unexpected endpoint: ${url}`);
        });

        await expect(getBookableEvent()).resolves.toEqual(event);
    });

    test("getSections validates status code before parsing", async () => {
        (fetch as jest.Mock).mockResolvedValue(new (global.Response as any)({}, { status: 503 }));

        await expect(getSections()).rejects.toThrow('"response" was not successful.');
    });
});

describe("backend helpers", () => {
    test("handleFieldError flattens nested errors into a sentence", () => {
        const errors = {
            participants: {
                0: {
                    first_name: "First required",
                    detail: { rule: "Must be letters only" },
                },
            },
        };

        expect(handleFieldError("participants", errors as any)).toBe("First required. Must be letters only.");
    });

    test("getParticipantServerErrors returns indexed participant errors", () => {
        const errors = {
            participants: {
                "1": {
                    last_name: {
                        required: "Last required",
                    },
                },
            },
        };

        expect(getParticipantServerErrors(1, errors as any)).toEqual(errors.participants["1"]);
        expect(getParticipantServerErrors(99, errors as any)).toEqual({});
    });

    test("handleReferenceNumber strips booking prefix and keeps numeric suffix", () => {
        expect(handleReferenceNumber("ABC123-045")).toBe("045");
        expect(handleReferenceNumber("NO_PREFIX")).toBe("_PREFIX");
    });
});

describe("lookup and check-in requests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("lookupEntry returns false on 404", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            status: 404,
            ok: false,
        });

        await expect(lookupEntry({ reference_number: "101", security_code: "abc" })).resolves.toBe(false);
    });

    test("lookupEntry returns entry on valid response", async () => {
        const entry = {
            id: "entry-1",
            event_id: "evt-1",
            entry_name: "Leader",
            participant_count: 1,
            checked_in_count: 0,
            created: "",
            modified: "",
            reference_number: 101,
            participants: [],
        };
        (fetch as jest.Mock).mockResolvedValue({
            status: 200,
            ok: true,
            json: jest.fn().mockResolvedValue({ entry }),
        });

        await expect(lookupEntry({ reference_number: "101", security_code: "abc" })).resolves.toEqual(entry);
    });

    test("submitCheckIn throws when server rejects request", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 500,
        });

        await expect(
            submitCheckIn({ checkpoint_id: "cp-1", entry_id: "entry-1", participants: ["p-1"] })
        ).rejects.toThrow("Server responded with 500");
    });

    test("submitCheckIn resolves true on success", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            status: 200,
        });

        await expect(
            submitCheckIn({ checkpoint_id: "cp-1", entry_id: "entry-1", participants: ["p-1"] })
        ).resolves.toBe(true);
    });
});

describe("cookie-backed storage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("storeEntry writes serialized entry cookie", () => {
        const entry = {
            id: "entry-1",
            event_id: "evt-1",
            entry_name: "Leader",
            participant_count: 1,
            checked_in_count: 0,
            created: "",
            modified: "",
            reference_number: 101,
            participants: [],
        };

        storeEntry(entry as any);
        expect(setCookie).toHaveBeenCalledWith("entry", JSON.stringify(entry), expect.any(Object));
    });

    test("getSavedEntry reads and parses stored entry cookie", () => {
        const storedEntry = {
            id: "entry-1",
            event_id: "evt-1",
            entry_name: "Leader",
            participant_count: 1,
            checked_in_count: 0,
            created: "",
            modified: "",
            reference_number: 101,
            participants: [],
        };
        (getCookie as jest.Mock).mockReturnValueOnce(JSON.stringify(storedEntry));

        expect(getSavedEntry()).toEqual(storedEntry);
    });

    test("storeEvent and getSavedEvent round-trip event cookie", () => {
        const event = {
            id: "evt-1",
            event_name: "Camp",
            event_description: "Weekend camp",
            booking_code: "ABC",
            start_time: "2026-01-01T10:00:00Z",
            bookable: true,
            finished: false,
            checkpoints: [],
            questions: [],
            sections: [],
        };

        storeEvent(event as any);
        expect(setCookie).toHaveBeenCalledWith("event", JSON.stringify(event), expect.any(Object));

        (getCookie as jest.Mock).mockReturnValueOnce(JSON.stringify(event));
        expect(getSavedEvent()).toEqual(event);
    });
});
