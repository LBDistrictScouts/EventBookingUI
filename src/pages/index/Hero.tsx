import {ReactElement} from "react";
import {Container, Image} from "react-bootstrap";
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
            <div className="row h-100">
                <div
                    className="col-md-10 col-xl-8 text-center d-flex d-sm-flex d-md-flex justify-content-center align-items-center mx-auto justify-content-md-start align-items-md-center justify-content-xl-center">
                    <div className="hero-panel">
                        <h1 className="text-uppercase fw-bold mb-3">{bookableEvent.event_name}</h1>
                        <Image src={'/img/greenway-walk-badge-26.png'} width={'100%'} className="hero-panel__badge" />
                        <p className="mb-4">{bookableEvent.event_description}</p>
                        <h2 className="text-uppercase fw-bold mb-3"><FormattedDate dt={bookableEvent.start_time} /></h2><a
                        className="btn btn-success fs-5 me-2 py-2 px-4" role="button" href={`/register/${bookableEvent.id}`}>Register</a>
                    </div>
                </div>
            </div>
        </Container>

    )
}
