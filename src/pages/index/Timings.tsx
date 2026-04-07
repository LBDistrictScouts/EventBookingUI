import {ReactElement} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export function Timings(): ReactElement {
    return (
        <Row className="info-section g-4 align-items-start">
            <Col xs={12} lg={4}>
                <aside className="info-panel info-panel--timings">
                    <div className="info-panel__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em"
                             fill="currentColor">
                            <path
                                d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"></path>
                        </svg>
                    </div>
                    <span className="info-panel__eyebrow">Timings</span>
                    <h3 className="info-panel__title">Plan the day before you set off.</h3>
                    <p className="info-panel__copy">
                        The key windows are short and simple. Arrive inside the check-in slot and aim to finish with time to spare.
                    </p>
                </aside>
            </Col>
            <Col xs={12} lg={8}>
                <div className="info-grid">
                    <article className="info-card info-card--timing">
                        <span className="info-card__kicker">Start Window</span>
                        <h4 className="info-card__title">Check in between 08:00 and 09:00</h4>
                        <p className="info-card__copy">
                            All participants must check in within an hour of 08:00.
                        </p>
                    </article>
                    <article className="info-card info-card--timing">
                        <span className="info-card__kicker">Finish Time</span>
                        <h4 className="info-card__title">Complete the walk before 16:00</h4>
                        <p className="info-card__copy">
                            We will send people around the course to pick up any stragglers.
                        </p>
                    </article>
                </div>
            </Col>
        </Row>
    )
}
