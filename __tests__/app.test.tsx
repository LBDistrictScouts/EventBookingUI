import { render, screen, waitFor } from "@testing-library/react";
import App from "../src/App";
import { getBookableEvent } from "../src/data/backend";
import { galleryImages } from "../__mocks__/lastYearGallery";

jest.mock("react-markdown", () => ({
    __esModule: true,
    default: ({ children }: { children: string }) => <>{children}</>,
}));

jest.mock("../src/data/backend", () => {
    const actual = jest.requireActual("../src/data/backend");
    return {
        ...actual,
        getBookableEvent: jest.fn(),
    };
});

function setViewport(width: number, height: number = 900) {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: width });
    Object.defineProperty(window, "innerHeight", { writable: true, configurable: true, value: height });
    window.dispatchEvent(new Event("resize"));
}

function createBookableEvent() {
    return {
        id: "event-1",
        event_name: "Greenway Walk",
        event_description: "A district walk for groups across the area.",
        booking_code: "GW25",
        start_time: "2026-05-18T08:00:00.000Z",
        bookable: true,
        finished: false,
        checkpoints: [
            { id: "cp-0", checkpoint_sequence: 0, checkpoint_name: "Start Field", event_id: "event-1" },
            { id: "cp-1", checkpoint_sequence: 1, checkpoint_name: "River Gate", event_id: "event-1" },
        ],
        questions: [
            {
                id: "q-1",
                event_id: "event-1",
                question_text: "What should we bring?",
                answer_text: "Bring water and a packed lunch.",
            },
        ],
        sections: [],
    };
}

describe("App", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        galleryImages.splice(0, galleryImages.length);
        galleryImages.push(
            { src: "/img/last-year/photo-1.jpg", alt: "Photo 1" },
            { src: "/img/last-year/photo-2.jpg", alt: "Photo 2" }
        );
        (getBookableEvent as jest.Mock).mockResolvedValue(createBookableEvent());
    });

    test("shows loading state before event data resolves", () => {
        (getBookableEvent as jest.Mock).mockReturnValue(new Promise(() => undefined));

        render(<App />);

        expect(screen.getByAltText(/loading/i)).toBeInTheDocument();
    });

    test.each([
        { name: "mobile", width: 390 },
        { name: "desktop", width: 1280 },
    ])("renders homepage sections at $name viewport width", async ({ width }) => {
        setViewport(width);

        render(<App />);

        await waitFor(() => {
            expect(screen.getByRole("heading", { name: /greenway walk/i })).toBeInTheDocument();
        });

        expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /edit registration/i })).toBeInTheDocument();
        expect(screen.getByText(/plan the day before you set off/i)).toBeInTheDocument();
        expect(screen.getByText(/follow the checkpoints in order/i)).toBeInTheDocument();
        expect(screen.getByText(/last year's walk/i)).toBeInTheDocument();
        expect(screen.getByText(/questions people usually ask before they book/i)).toBeInTheDocument();
    });
});
