import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { getCookie } from "typescript-cookie";
import EditRegister from "../src/pages/edit/EditRegister";
import { getEntry, getParticipantTypes, getSections, SubmitEditedEntryData } from "../src/data/backend";
import { Entry, SavedEntry } from "../src/data/dataTypes";

jest.mock("uuid", () => ({
    v4: () => "mock-access-key",
}));

jest.mock("../src/data/backend", () => {
    const actual = jest.requireActual("../src/data/backend");
    return {
        ...actual,
        getEntry: jest.fn(),
        getParticipantTypes: jest.fn(),
        getSections: jest.fn(),
        SubmitEditedEntryData: jest.fn(),
    };
});

const savedEntry: SavedEntry = {
    id: "entry-123",
    event_id: "event-123",
    entry_name: "Alpha Team",
    entry_email: "alpha@example.com",
    entry_mobile: "07000111222",
    security_code: "SEC123",
    reference_number: 101,
    created: "",
    modified: "",
    participants: [
        {
            id: "p-1",
            entry_id: "entry-123",
            first_name: "Sam",
            last_name: "Walker",
            full_name: "Sam Walker",
            participant_type_id: undefined,
            section_id: undefined,
            created: "",
            modified: "",
        },
        {
            id: "p-2",
            entry_id: "entry-123",
            first_name: "Alex",
            last_name: "Hill",
            full_name: "Alex Hill",
            participant_type_id: undefined,
            section_id: undefined,
            created: "",
            modified: "",
        },
    ],
};

const entryFromPath: Entry = {
    id: "entry-path",
    event_id: "event-456",
    entry_name: "Path Team",
    participant_count: 2,
    checked_in_count: 0,
    created: "",
    modified: "",
    reference_number: 202,
    participants: [
        {
            id: "p-path-1",
            entry_id: "entry-path",
            first_name: "Pat",
            last_name: "River",
            participant_type_id: "pt-1",
            section_id: "section-1",
            checked_in: false,
            checked_out: false,
            created: "",
            modified: "",
            deleted: null,
            highest_check_in_sequence: 0,
            participant_type: {
                id: "pt-1",
                participant_type: "Leader / Volunteer",
                adult: true,
                uniformed: true,
                out_of_district: false,
                category: "Adult",
                created: "",
                modified: "",
                deleted: null,
            },
            section: {
                id: "section-1",
                section_name: "4th Letchworth Scouts",
                participant_type_id: "pt-1",
                group_id: "group-1",
                osm_section_id: 9560,
                created: "",
                modified: "",
                deleted: null,
            },
            full_name: "Pat River",
        },
        {
            id: "p-path-2",
            entry_id: "entry-path",
            first_name: "Jo",
            last_name: "Field",
            participant_type_id: "pt-2",
            section_id: "section-2",
            checked_in: false,
            checked_out: false,
            created: "",
            modified: "",
            deleted: null,
            highest_check_in_sequence: 0,
            participant_type: {
                id: "pt-2",
                participant_type: "Young Person",
                adult: false,
                uniformed: false,
                out_of_district: false,
                category: "Youth",
                created: "",
                modified: "",
                deleted: null,
            },
            section: {
                id: "section-2",
                section_name: "Visitors",
                participant_type_id: "pt-2",
                group_id: "group-2",
                osm_section_id: 0,
                created: "",
                modified: "",
                deleted: null,
            },
            full_name: "Jo Field",
        },
    ],
};

const matchingEntryFromPath: Entry = {
    id: "entry-123",
    event_id: "event-123",
    entry_name: "Alpha Team",
    participant_count: 2,
    checked_in_count: 0,
    created: "",
    modified: "",
    reference_number: 101,
    participants: [
        {
            id: "p-1",
            entry_id: "entry-123",
            first_name: "Sam",
            last_name: "Walker",
            participant_type_id: "pt-1",
            section_id: "section-1",
            checked_in: false,
            checked_out: false,
            created: "",
            modified: "",
            deleted: null,
            highest_check_in_sequence: 0,
            full_name: "Sam Walker",
        },
        {
            id: "p-2",
            entry_id: "entry-123",
            first_name: "Alex",
            last_name: "Hill",
            participant_type_id: "pt-2",
            section_id: "section-2",
            checked_in: false,
            checked_out: false,
            created: "",
            modified: "",
            deleted: null,
            highest_check_in_sequence: 0,
            full_name: "Alex Hill",
        },
    ],
};

describe("Edit registration route", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (getCookie as jest.Mock).mockReturnValue(JSON.stringify(savedEntry));
        (getEntry as jest.Mock).mockResolvedValue(entryFromPath);
        (getParticipantTypes as jest.Mock).mockResolvedValue([]);
        (getSections as jest.Mock).mockResolvedValue([]);
        (SubmitEditedEntryData as jest.Mock).mockImplementation(
            async (_entryId: string, _payload: unknown, _setServerErrors: unknown, setSavedEntry: (entry: Entry) => void) => {
                setSavedEntry(matchingEntryFromPath);
                return { success: true, entry: matchingEntryFromPath };
            }
        );
    });

    test("loads existing entry values and submits edit payload with entry id", async () => {
        render(
            <MemoryRouter initialEntries={["/edit/entry-123"]}>
                <Routes>
                    <Route path="/edit/:entry_id" element={<EditRegister />} />
                </Routes>
            </MemoryRouter>
        );

        expect(await screen.findByText(/edit registration/i)).toBeInTheDocument();
        expect((await screen.findByPlaceholderText(/walking group name/i) as HTMLInputElement).value).toBe("Alpha Team");
        expect((await screen.findByPlaceholderText(/email address/i) as HTMLInputElement).value).toBe("alpha@example.com");
        expect((screen.getByPlaceholderText(/mobile number/i) as HTMLInputElement).value).toBe("07000111222");

        const saveButton = screen.getByRole("button", { name: /save registration changes/i });
        expect(saveButton).toBeDisabled();
        fireEvent.click(screen.getByRole("button", { name: /review statement/i }));
        expect(await screen.findByRole("dialog")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("checkbox", { name: /i have reviewed and accept this gdpr & privacy use statement/i }));
        fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
        await waitFor(() => {
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
            expect(saveButton).toBeEnabled();
        });

        fireEvent.click(screen.getByRole("button", { name: /save registration changes/i }));
        await waitFor(() => {
            expect(SubmitEditedEntryData).toHaveBeenCalledTimes(1);
        });

        const [entryId, payload] = (SubmitEditedEntryData as jest.Mock).mock.calls[0];
        expect(entryId).toBe("entry-123");
        expect(payload.event_id).toBe("event-123");
        expect(payload.entry_email).toBe("alpha@example.com");
        expect(payload.entry_mobile).toBe("07000111222");
        expect(getEntry).not.toHaveBeenCalled();
        expect(await screen.findByText(/registration updated/i)).toBeInTheDocument();
        expect(screen.getByText(/^participants$/i)).toBeInTheDocument();
        expect(screen.getByText("Sam Walker")).toBeInTheDocument();
        expect(screen.getByText("Alex Hill")).toBeInTheDocument();
        expect(screen.getAllByText("Participant type not provided")).toHaveLength(2);
        expect(screen.queryByText("Section not provided")).not.toBeInTheDocument();
        expect(screen.getByText(/edit this registration again/i)).toBeInTheDocument();
    });

    test("fetches entry from path when cookie is missing", async () => {
        (getCookie as jest.Mock).mockReturnValue(undefined);

        render(
            <MemoryRouter initialEntries={["/edit/entry-path"]}>
                <Routes>
                    <Route path="/edit/:entry_id" element={<EditRegister />} />
                </Routes>
            </MemoryRouter>
        );

        expect(await screen.findByText(/edit registration/i)).toBeInTheDocument();
        expect(getEntry).toHaveBeenCalledWith("entry-path");
        expect(await screen.findByDisplayValue("Path Team")).toBeInTheDocument();
        expect(screen.queryByPlaceholderText(/email address/i)).not.toBeInTheDocument();
        expect(screen.queryByPlaceholderText(/mobile number/i)).not.toBeInTheDocument();
    });

    test("ignores cookie entry when it does not match the requested path entry id", async () => {
        render(
            <MemoryRouter initialEntries={["/edit/entry-path"]}>
                <Routes>
                    <Route path="/edit/:entry_id" element={<EditRegister />} />
                </Routes>
            </MemoryRouter>
        );

        expect(await screen.findByDisplayValue("Path Team")).toBeInTheDocument();
        expect(getEntry).toHaveBeenCalledWith("entry-path");
    });

    test("keeps matching pii cookie data when a path fetch returns a slim entry", async () => {
        let cookieReadCount = 0;
        (getCookie as jest.Mock).mockImplementation(() => {
            cookieReadCount += 1;

            if (cookieReadCount <= 2) {
                return undefined;
            }

            return JSON.stringify(savedEntry);
        });
        (getEntry as jest.Mock).mockResolvedValue(matchingEntryFromPath);

        render(
            <MemoryRouter initialEntries={["/edit/entry-123"]}>
                <Routes>
                    <Route path="/edit/:entry_id" element={<EditRegister />} />
                </Routes>
            </MemoryRouter>
        );

        expect(await screen.findByDisplayValue("Alpha Team")).toBeInTheDocument();
        expect((await screen.findByPlaceholderText(/email address/i) as HTMLInputElement).value).toBe("alpha@example.com");
        expect((screen.getByPlaceholderText(/mobile number/i) as HTMLInputElement).value).toBe("07000111222");
        expect(getEntry).toHaveBeenCalledWith("entry-123");
    });

    test("submits non-pii edit payload without requiring hidden pii fields", async () => {
        (getCookie as jest.Mock).mockReturnValue(undefined);
        (SubmitEditedEntryData as jest.Mock).mockImplementation(
            async (_entryId: string, _payload: unknown, _setServerErrors: unknown, setSavedEntry: (entry: Entry) => void) => {
                setSavedEntry(entryFromPath);
                return { success: true, entry: entryFromPath };
            }
        );

        render(
            <MemoryRouter initialEntries={["/edit/entry-path"]}>
                <Routes>
                    <Route path="/edit/:entry_id" element={<EditRegister />} />
                </Routes>
            </MemoryRouter>
        );

        expect(await screen.findByDisplayValue("Path Team")).toBeInTheDocument();
        expect(screen.queryByPlaceholderText(/email address/i)).not.toBeInTheDocument();
        expect(screen.queryByPlaceholderText(/mobile number/i)).not.toBeInTheDocument();

        const saveButton = screen.getByRole("button", { name: /save registration changes/i });
        fireEvent.click(screen.getByRole("button", { name: /review statement/i }));
        expect(await screen.findByRole("dialog")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("checkbox", { name: /i have reviewed and accept this gdpr & privacy use statement/i }));
        fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

        await waitFor(() => {
            expect(saveButton).toBeEnabled();
        });

        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(SubmitEditedEntryData).toHaveBeenCalledTimes(1);
        });

        const [entryId, payload] = (SubmitEditedEntryData as jest.Mock).mock.calls[0];
        expect(entryId).toBe("entry-path");
        expect(payload.event_id).toBe("event-456");
        expect(payload).not.toHaveProperty("entry_email");
        expect(payload).not.toHaveProperty("entry_mobile");
        expect(await screen.findByText(/registration updated/i)).toBeInTheDocument();
        expect(screen.getByText(/walking group name:/i)).toBeInTheDocument();
        expect(screen.queryByText(/contact email:/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/contact mobile:/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/security code/i)).not.toBeInTheDocument();
        expect(screen.getByText(/^booking reference$/i)).toBeInTheDocument();
        expect(screen.getByText(/^participants$/i)).toBeInTheDocument();
        expect(screen.getByText("Pat River")).toBeInTheDocument();
        expect(screen.getByText("Jo Field")).toBeInTheDocument();
        expect(screen.getByText("Leader / Volunteer")).toBeInTheDocument();
        expect(screen.getByText("Young Person")).toBeInTheDocument();
        expect(screen.getByText("4th Letchworth Scouts")).toBeInTheDocument();
        expect(screen.getByText("Visitors")).toBeInTheDocument();
        expect(screen.getByText("Adult")).toBeInTheDocument();
        expect(screen.getByText("Uniformed")).toBeInTheDocument();
    });
});
