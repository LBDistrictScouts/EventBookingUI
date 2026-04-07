import {ReactElement, useMemo} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {galleryImages} from "virtual:last-year-gallery";

const displayVariants = [
    "walk-gallery__item--landscape",
    "walk-gallery__item--portrait",
    "walk-gallery__item--square"
];

function shuffle<T>(items: T[]): T[] {
    const result = [...items];

    for (let index = result.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        const current = result[index];
        result[index] = result[swapIndex];
        result[swapIndex] = current;
    }

    return result;
}

export function LastYearsWalk(): ReactElement {
    const selectedImages = useMemo(
        () => shuffle(galleryImages).slice(0, 12).map((image, index) => ({
            ...image,
            className: `walk-gallery__item ${displayVariants[index % displayVariants.length]}`
        })),
        []
    );

    return (
        <Row className="gallery-section g-4 align-items-start">
            <Col xs={12} lg={4}>
                <aside className="gallery-panel">
                    <span className="gallery-panel__eyebrow">Last Year's Walk</span>
                    <h3 className="gallery-panel__title">A quick look at the atmosphere from last time.</h3>
                    <p className="gallery-panel__copy">
                        A few moments from the day itself: arrivals, volunteers, and groups out on the route.
                    </p>
                </aside>
            </Col>
            <Col xs={12} lg={8}>
                {selectedImages.length > 0 ? (
                    <div className="walk-gallery">
                        {selectedImages.map((image) => (
                            <figure className={image.className} key={image.src}>
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    loading="lazy"
                                    decoding="async"
                                    className="walk-gallery__image"
                                />
                            </figure>
                        ))}
                    </div>
                ) : (
                    <div className="walk-gallery walk-gallery--empty">
                        <p className="walk-gallery__empty-copy">
                            Add photos to <code>public/img/last-year</code> to populate this gallery.
                        </p>
                    </div>
                )}
            </Col>
        </Row>
    );
}
