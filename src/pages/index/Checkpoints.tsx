import {ReactElement} from "react";
import {BookableEvent, Checkpoint} from "../../data/dataTypes.ts";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export function Checkpoints({bookableEvent}: {bookableEvent: BookableEvent}): ReactElement {
    const checkpoints = bookableEvent.checkpoints.filter(
        (cp) => Number.isInteger(cp.checkpoint_sequence) && cp.checkpoint_sequence >= 0
    );

    return (
        <Row className="info-section g-4 align-items-start">
            <Col xs={12} lg={4}>
                <aside className="info-panel info-panel--checkpoints">
                    <div className="info-panel__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-64 0 512 512" width="1em" height="1em"
                             fill="currentColor">
                            <path
                                d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"></path>
                        </svg>
                    </div>
                    <span className="info-panel__eyebrow">Route</span>
                    <h3 className="info-panel__title">Follow the checkpoints in order.</h3>
                    <p className="info-panel__copy">
                        Each stage of the walk is sequenced, so you can see the route flow before the day begins.
                    </p>
                </aside>
            </Col>
            <Col xs={12} lg={8}>
                <div className="route-card">
                    <div className="route-card__header">
                        <span className="route-card__eyebrow">Checkpoint Sequence</span>
                        <h4 className="route-card__title">Walk route</h4>
                    </div>
                    <ol className="route-list" start={0}>
                        {checkpoints.map((ckpt: Checkpoint) => {
                            return (
                                <li key={ckpt.checkpoint_sequence} className="route-list__item">
                                    <span className="route-list__index">
                                        <span className="route-list__index-label">{ckpt.checkpoint_sequence}</span>
                                    </span>
                                    <span className="route-list__name">{ckpt.checkpoint_name}</span>
                                </li>
                            )
                        })}
                    </ol>
                </div>
            </Col>
        </Row>
    )
}
