import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import RegistrationForm from "../src/pages/register/RegistrationForm";
import { getParticipantTypes, getSections, SubmitEntryData } from "../src/data/backend";

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

function renderForm() {
    const setSavedEntry = jest.fn();
    render(
        <MemoryRouter initialEntries={["/register/event-1"]}>
            <Routes>
                <Route path="/register/:event_id" element={<RegistrationForm setSavedEntry={setSavedEntry} />} />
            </Routes>
        </MemoryRouter>
    );
}

async function waitForFormReady() {
    await screen.findByRole("button", { name: /register for walk/i });
}

async function acknowledgePrivacyStatement() {
    fireEvent.click(screen.getByRole("button", { name: /review statement/i }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: /i have reviewed and accept this gdpr & privacy use statement/i }));
    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
    await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
}

function fillRequiredEntryFields() {
    fireEvent.change(screen.getByPlaceholderText(/walking group name/i), { target: { value: "Group Alpha" } });
    fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value: "lead@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/mobile number/i), { target: { value: "07123456789" } });
}

describe("RegistrationForm submit warnings", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (getParticipantTypes as jest.Mock).mockResolvedValue([]);
        (getSections as jest.Mock).mockResolvedValue([]);
        (SubmitEntryData as jest.Mock).mockResolvedValue({ success: true });
    });

    test("prevents submission and shows warning when submitted without participants", async () => {
        renderForm();
        await waitForFormReady();
        await acknowledgePrivacyStatement();

        fillRequiredEntryFields();
        fireEvent.click(screen.getByRole("button", { name: /register for walk/i }));

        expect(await screen.findByText(/at least one participant is required/i)).toBeInTheDocument();
        expect(SubmitEntryData).not.toHaveBeenCalled();
    });

    test("for one participant, requires dismissing warning before allowing submission", async () => {
        renderForm();
        await waitForFormReady();
        await acknowledgePrivacyStatement();

        fillRequiredEntryFields();
        fireEvent.click(screen.getByRole("button", { name: /add participant/i }));
        fireEvent.change(screen.getByPlaceholderText(/first name/i), { target: { value: "Sam" } });
        fireEvent.change(screen.getByPlaceholderText(/last name/i), { target: { value: "Walker" } });

        fireEvent.click(screen.getByRole("button", { name: /register for walk/i }));

        expect(await screen.findByText(/contains only one participant/i)).toBeInTheDocument();
        expect(SubmitEntryData).not.toHaveBeenCalled();

        fireEvent.click(screen.getByRole("button", { name: /close/i }));
        await waitFor(() => {
            expect(screen.queryByText(/contains only one participant/i)).not.toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole("button", { name: /register for walk/i }));
        await waitFor(() => {
            expect(SubmitEntryData).toHaveBeenCalledTimes(1);
        });
    });

    test("keeps submit disabled until privacy modal is acknowledged and then shows checked confirmation", async () => {
        renderForm();
        await waitForFormReady();

        const submitButton = screen.getByRole("button", { name: /register for walk/i });
        expect(submitButton).toBeDisabled();
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /review statement/i }));
        expect(await screen.findByRole("dialog")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("checkbox", { name: /i have reviewed and accept this gdpr & privacy use statement/i }));
        fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

        await waitFor(() => {
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
            expect(submitButton).toBeEnabled();
        });

        expect(screen.getByRole("checkbox", { name: /gdpr & privacy use statement acknowledged/i })).toBeChecked();
        expect(screen.queryByText(/personally identifiable information/i)).not.toBeInTheDocument();
    });
});
