import {ReactElement} from "react";
import {Col, Container, Image, Row} from "react-bootstrap";
import {BookableEvent} from "../../data/dataTypes.ts";
import dayjs from "dayjs";

interface FmtProps {
    dt: string;
}

function FormattedDate({ dt }: FmtProps): ReactElement {
    return <span>{dayjs(dt).format("DD-MMM-YY")}</span>;
}

export function Hero({bookableEvent}: {bookableEvent: BookableEvent}): ReactElement {
    return (
        <Container className={'h-100'} >
            <Row className="h-100 justify-content-center">
                <Col md={10} xl={9} className="d-flex align-items-center justify-content-center">
                    <section className="hero-panel p-3 p-lg-4">
                        <div className="hero-panel__header mb-4 text-center">
                            <span className="hero-panel__eyebrow">District Event</span>
                            <h1 className="text-uppercase fw-bold mb-3">{bookableEvent.event_name}</h1>
                            <p className="hero-panel__description">{bookableEvent.event_description}</p>
                        </div>
                        <Row className="hero-panel__body g-4 g-xl-5 align-items-center justify-content-center">
                            <Col xs={12} lg={5} className="d-flex">
                            <div className="hero-panel__content d-flex flex-column gap-3 text-center w-100">
                                <div className="hero-panel__actions d-grid gap-2">
                                    <a
                                        className="btn btn-success btn-lg d-block hero-panel__primary-action"
                                        role="button"
                                        href={`/register/${bookableEvent.id}`}
                                    >
                                        Register
                                    </a>
                                    <a
                                        className="btn btn-outline-secondary hero-panel__secondary-action"
                                        role="button"
                                        href="/edit"
                                    >
                                        Edit registration
                                    </a>
                                </div>
                                <div className="hero-panel__meta d-flex justify-content-center">
                                    <div className="hero-panel__date mx-auto">
                                        <span className="hero-panel__meta-label">Walk Date</span>
                                        <h2 className="text-uppercase fw-bold mb-0"><FormattedDate dt={bookableEvent.start_time} /></h2>
                                    </div>
                                </div>
                            </div>
                            </Col>
                            <Col xs={12} lg={5} className="d-flex justify-content-center">
                            <div className="hero-panel__visual w-100">
                                    <div className="hero-panel__badge-card mx-auto">
                                        <Image src={'/img/greenway-walk-badge-26.png'} width={'100%'} className="hero-panel__badge" />
                                        <div className="hero-panel__badge-caption">
                                            <span className="hero-panel__badge-caption-label">Collectable badge</span>
                                            <p className="hero-panel__badge-caption-copy">
                                                This year&apos;s event badge is awarded on completion of the walk.
                                            </p>
                                        </div>
                                    </div>
                            </div>
                            </Col>
                        </Row>
                    </section>
                </Col>
            </Row>
        </Container>

    )
}
