import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Hero } from "../src/pages/index/Hero";
import { Timings } from "../src/pages/index/Timings";
import { Checkpoints } from "../src/pages/index/Checkpoints";
import { Questions } from "../src/pages/index/Questions";
import { LastYearsWalk } from "../src/pages/index/LastYearsWalk";
import { BookableEvent } from "../src/data/dataTypes";
import { galleryImages } from "../__mocks__/lastYearGallery";

jest.mock("react-markdown", () => ({
    __esModule: true,
    default: ({ children }: { children: string }) => <>{children}</>,
}));

function createBookableEvent(overrides: Partial<BookableEvent> = {}): BookableEvent {
    return {
        id: "event-1",
        event_name: "Greenway Walk",
        event_description: "A district walk for groups across the area.",
        booking_code: "GW25",
        start_time: "2026-05-18T08:00:00.000Z",
        bookable: true,
        finished: false,
        checkpoints: [
            {
                id: "cp-0",
                checkpoint_sequence: 0,
                checkpoint_name: "Start Field",
                event_id: "event-1",
            },
            {
                id: "cp-1",
                checkpoint_sequence: 1,
                checkpoint_name: "River Gate",
                event_id: "event-1",
            },
        ],
        questions: [
            {
                id: "q-1",
                event_id: "event-1",
                question_text: "What should we bring?",
                answer_text: "Bring water and a packed lunch.",
            },
            {
                id: "q-2",
                event_id: "event-1",
                question_text: "Can we edit our booking later?",
                answer_text: "Yes, use the edit registration link.",
            },
        ],
        sections: [],
        ...overrides,
    };
}

describe("homepage sections", () => {
    beforeEach(() => {
        galleryImages.splice(0, galleryImages.length);
        jest.restoreAllMocks();
    });

    test("Hero renders primary and secondary calls to action", () => {
        render(
            <MemoryRouter>
                <Hero bookableEvent={createBookableEvent()} />
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { name: /greenway walk/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /register/i })).toHaveAttribute("href", "/register/event-1");
        expect(screen.getByRole("button", { name: /edit registration/i })).toHaveAttribute("href", "/edit");
        expect(screen.getByText("18-May-26")).toBeInTheDocument();
    });

    test("Timings renders the start and finish guidance cards", () => {
        render(<Timings />);

        expect(screen.getByText(/plan the day before you set off/i)).toBeInTheDocument();
        expect(screen.getByText(/check in between 08:00 and 09:00/i)).toBeInTheDocument();
        expect(screen.getByText(/complete the walk before 16:00/i)).toBeInTheDocument();
    });

    test("Checkpoints filters out invalid sequences and renders valid route points", () => {
        const bookableEvent = createBookableEvent({
            checkpoints: [
                {
                    id: "cp-0",
                    checkpoint_sequence: 0,
                    checkpoint_name: "Start Field",
                    event_id: "event-1",
                },
                {
                    id: "cp-invalid",
                    checkpoint_sequence: -1,
                    checkpoint_name: "Hidden Stop",
                    event_id: "event-1",
                },
                {
                    id: "cp-2",
                    checkpoint_sequence: 2,
                    checkpoint_name: "Finish Meadow",
                    event_id: "event-1",
                },
            ],
        });

        render(<Checkpoints bookableEvent={bookableEvent} />);

        expect(screen.getByText(/follow the checkpoints in order/i)).toBeInTheDocument();
        expect(screen.getByText("Start Field")).toBeInTheDocument();
        expect(screen.getByText("Finish Meadow")).toBeInTheDocument();
        expect(screen.queryByText("Hidden Stop")).not.toBeInTheDocument();
    });

    test("Questions opens the first answer by default and switches when another question is selected", () => {
        render(<Questions bookableEvent={createBookableEvent()} />);

        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.getByText(/quick answers/i)).toBeInTheDocument();
        expect(screen.getByText(/bring water and a packed lunch/i)).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /can we edit our booking later/i }));

        expect(screen.getByText(/yes, use the edit registration link/i)).toBeInTheDocument();
    });

    test("LastYearsWalk limits the rendered gallery to 12 lazy-loaded images", () => {
        for (let index = 1; index <= 15; index += 1) {
            galleryImages.push({
                src: `/img/last-year/photo-${index}.jpg`,
                alt: `Photo ${index}`,
            });
        }

        jest.spyOn(Math, "random").mockReturnValue(0.5);

        render(<LastYearsWalk />);

        const images = screen.getAllByRole("img");
        expect(images).toHaveLength(12);
        expect(images[0]).toHaveAttribute("loading", "lazy");
        expect(images[0]).toHaveAttribute("decoding", "async");
    });

    test("LastYearsWalk shows an empty state when no gallery images exist", () => {
        render(<LastYearsWalk />);

        expect(screen.getByText(/add photos to/i)).toBeInTheDocument();
    });
});
