import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import EditLookupForm from "../src/pages/edit/EditLookupForm";
import { handleReferenceNumber, lookupEntry } from "../src/data/backend";
import { setValidCookie } from "../src/data/utilities";

jest.mock("../src/data/backend", () => {
    const actual = jest.requireActual("../src/data/backend");
    return {
        ...actual,
        handleReferenceNumber: jest.fn(),
        lookupEntry: jest.fn(),
    };
});

jest.mock("../src/data/utilities", () => {
    const actual = jest.requireActual("../src/data/utilities");
    return {
        ...actual,
        setValidCookie: jest.fn(),
    };
});

describe("EditLookupForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (handleReferenceNumber as jest.Mock).mockImplementation((value: string) => value);
    });

    test("shows validation message when fields are empty", async () => {
        render(<EditLookupForm onEntryLoaded={jest.fn()} />);

        fireEvent.change(screen.getByPlaceholderText("123"), { target: { value: " " } });
        fireEvent.change(screen.getByPlaceholderText("ABC12"), { target: { value: " " } });
        fireEvent.click(screen.getByRole("button", { name: /find registration/i }));

        expect(await screen.findByText(/one or both fields are empty/i)).toBeInTheDocument();
        expect(lookupEntry).not.toHaveBeenCalled();
    });

    test("loads entry and persists cookie on successful lookup", async () => {
        const onEntryLoaded = jest.fn();
        const entry = {
            id: "entry-1",
            event_id: "evt-1",
            entry_name: "Alpha Team",
            entry_email: "lead@example.com",
            entry_mobile: "07123456789",
            security_code: "SEC123",
            reference_number: 101,
            created: "",
            modified: "",
            participants: [],
        };
        (lookupEntry as jest.Mock).mockResolvedValue(entry);

        render(<EditLookupForm onEntryLoaded={onEntryLoaded} />);

        fireEvent.change(screen.getByPlaceholderText("123"), { target: { value: "101" } });
        fireEvent.change(screen.getByPlaceholderText("ABC12"), { target: { value: "SEC123" } });
        fireEvent.click(screen.getByRole("button", { name: /find registration/i }));

        await waitFor(() => {
            expect(lookupEntry).toHaveBeenCalledTimes(1);
            expect(setValidCookie).toHaveBeenCalledWith("entry", JSON.stringify(entry));
            expect(onEntryLoaded).toHaveBeenCalledWith(entry);
        });
    });

    test("shows invalid combination message when lookup returns no entry", async () => {
        (lookupEntry as jest.Mock).mockResolvedValue(false);
        render(<EditLookupForm onEntryLoaded={jest.fn()} />);

        fireEvent.change(screen.getByPlaceholderText("123"), { target: { value: "101" } });
        fireEvent.change(screen.getByPlaceholderText("ABC12"), { target: { value: "BAD" } });
        fireEvent.click(screen.getByRole("button", { name: /find registration/i }));

        expect(await screen.findByText(/reference number & security code combination is invalid/i)).toBeInTheDocument();
    });
});
