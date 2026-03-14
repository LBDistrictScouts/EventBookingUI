import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { getCookie } from "typescript-cookie";
import EditRegister from "../src/pages/edit/EditRegister";
import { getParticipantTypes, getSections, SubmitEntryData } from "../src/data/backend";
import { SavedEntry } from "../src/data/dataTypes";

jest.mock("uuid", () => ({
    v4: () => "mock-access-key",
}));

jest.mock("../src/data/backend", () => {
    const actual = jest.requireActual("../src/data/backend");
    return {
        ...actual,
        getParticipantTypes: jest.fn(),
        getSections: jest.fn(),
        SubmitEntryData: jest.fn(),
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

describe("Edit registration route", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (getCookie as jest.Mock).mockReturnValue(JSON.stringify(savedEntry));
        (getParticipantTypes as jest.Mock).mockResolvedValue([]);
        (getSections as jest.Mock).mockResolvedValue([]);
        (SubmitEntryData as jest.Mock).mockResolvedValue({ success: true, entry: savedEntry });
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
        expect(screen.queryByPlaceholderText(/email address/i)).not.toBeInTheDocument();
        expect(screen.queryByPlaceholderText(/mobile number/i)).not.toBeInTheDocument();

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
            expect(SubmitEntryData).toHaveBeenCalledTimes(1);
        });

        const [payload] = (SubmitEntryData as jest.Mock).mock.calls[0];
        expect(payload.entry_id).toBe("entry-123");
        expect(payload.event_id).toBe("event-123");
    });
});
