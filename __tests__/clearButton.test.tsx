import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { removeCookie } from "typescript-cookie";
import ClearButton from "../src/pages/checkin/ClearButton";

describe("ClearButton", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("cancel dismisses confirmation without clearing", async () => {
        const setEntry = jest.fn();
        render(<ClearButton setEntry={setEntry} buttonText="Clear Saved Team" />);

        fireEvent.click(screen.getByRole("button", { name: /clear saved team/i }));
        expect(await screen.findByRole("dialog")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
        await waitFor(() => {
            expect(screen.queryByText(/this will clear the cached team/i)).not.toBeInTheDocument();
        });

        expect(removeCookie).not.toHaveBeenCalled();
        expect(setEntry).not.toHaveBeenCalled();
    });

    test("confirm clears both cookie keys and resets entry state", async () => {
        const setEntry = jest.fn();
        render(<ClearButton setEntry={setEntry} />);

        fireEvent.click(screen.getByRole("button", { name: /refresh team members/i }));
        fireEvent.click(await screen.findByRole("button", { name: /yes, clear/i }));

        await waitFor(() => {
            expect(setEntry).toHaveBeenCalledWith(undefined);
        });

        expect(removeCookie).toHaveBeenCalledWith("entry");
        expect(removeCookie).toHaveBeenCalledWith("saved-entry");
        expect(removeCookie).toHaveBeenCalledWith("entry", { path: "/" });
        expect(removeCookie).toHaveBeenCalledWith("entry", { path: "/check-in" });
        expect(removeCookie).toHaveBeenCalledWith("saved-entry", { path: "/edit", domain: "localhost" });
    });
});
