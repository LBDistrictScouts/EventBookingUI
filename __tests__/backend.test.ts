import { fetchRequest, getOriginDevLocalhost } from "../src/data/backend";

global.Request = jest.fn().mockImplementation((url, options) => ({
    url,
    ...options,
}));

// Mock global fetch for API calls
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Success" }),
    })
) as jest.Mock;


// Mock window.location for getOriginDevLocalhost
const mockLocation = {
    href: "http://localhost:5173",
};
Object.defineProperty(window, "location", {
    value: mockLocation,
    writable: true,
});

describe("Backend Utilities", () => {
    test("getOriginDevLocalhost converts HTTP to HTTPS for localhost", () => {
        expect(getOriginDevLocalhost()).toBe("https://localhost:5173");
    });

    test("getOriginDevLocalhost does not change non-localhost URLs", () => {
        window.location.href = "https://example.com";
        expect(getOriginDevLocalhost()).toBe("https://example.com");
    });
});

describe("fetchRequest", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    test("fetchRequest makes a GET request and returns response", async () => {
        const mockResponse = { message: "Success" };
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockResponse),
        });

        const response = await fetchRequest("/test-endpoint");
        const json = await response.json();

        expect(fetch).toHaveBeenCalledWith(
            "http://localhost/test-endpoint",
            expect.objectContaining({
                method: "GET",
                mode: "cors",
                headers: expect.any(Object),
            })
        );
        expect(json).toEqual(mockResponse);
    });

    test("fetchRequest makes a POST request with data", async () => {
        const mockResponse = { message: "Created" };
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockResponse),
        });

        const postData = { name: "John Doe" };
        const response = await fetchRequest("/submit", "POST", postData);
        const json = await response.json();

        const mockedFetch = fetch as jest.Mock;
        console.log(mockedFetch.mock.calls);

        expect(fetch).toHaveBeenCalledWith(
            expect.any("http://localhost/submit"),
            {
                body: JSON.stringify({ name: "John Doe" }),
                method: "POST",
                mode: "cors",
                headers: expect.any(Object),
            }
        );
        expect(json).toEqual(mockResponse);
    });

    test("fetchRequest throws error on failed request", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
        });

        await expect(fetchRequest("/fail")).rejects.toThrow("Internal Server Error");
    });
});