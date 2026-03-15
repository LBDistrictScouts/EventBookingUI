import { ReactElement } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { PersistedEntry } from "../../data/dataTypes.ts";
import { isSavedEntry } from "../../data/backend.ts";

interface RegistrationConfirmationProps {
    entry: PersistedEntry;
    title?: string;
    description?: string;
    editLinkText?: string;
}

function RegistrationConfirmation({
    entry,
    title = "Registration Confirmed",
    description = "You will receive an email confirming the above information. You will need the booking reference and security code to register on the day of the walk.",
    editLinkText = "Edit this registration",
}: RegistrationConfirmationProps): ReactElement {
    const hasPii = isSavedEntry(entry);
    const resolvedDescription = description || (
        hasPii
            ? "You will receive an email confirming the above information. You will need the booking reference and security code to register on the day of the walk."
            : "Your registration details have been saved. Keep your booking reference to hand for the day of the walk."
    );

    return (
        <Card className="shadow-lg o-hidden border-0 p-0 my-5">
            <Card.Body className="p-0">
                <Row>
                    <Col lg={5} className={'d-none d-lg-flex'} >
                        <div className="flex-grow-1 bg-confirmation-image"></div>
                    </Col>
                    <Col lg={7}>
                        <div className="p-3 p-lg-5">
                            <div className="card bg-success bg-opacity-25 px-0 px-md-3">
                                <div className="card-body">
                                    <h4 className="card-title">{title}</h4>
                                    <h6 className="text-muted card-subtitle my-3">Walking Group Name: <strong>"{entry.entry_name}"</strong></h6>
                                    {hasPii && <h6 className="text-muted card-subtitle my-3">Contact Email: <strong>"{entry.entry_email}"</strong></h6>}
                                    {hasPii && <h6 className="text-muted card-subtitle my-3">Contact Mobile: <strong>"{entry.entry_mobile}"</strong></h6>}
                                    <div className="card my-3 px-0 px-md-2 px-lg-3">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className={hasPii ? "col-sm-7" : "col"}>
                                                    <p className="fs-1">{entry.reference_number}</p>
                                                    <p>Booking Reference</p>
                                                </div>
                                                {hasPii && (
                                                    <div className="col">
                                                        <p className="fs-1">{entry.security_code}</p>
                                                        <p>Security Code</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card my-3 px-0 px-md-2 px-lg-3">
                                        <div className="card-body">
                                            <h5 className="card-title mb-3">Participants</h5>
                                            <div className="d-grid gap-2">
                                                {entry.participants.map((participant) => (
                                                    <div key={participant.id} className="border rounded-3 bg-light px-3 py-2">
                                                        <div className="fw-semibold">{participant.full_name}</div>
                                                        <div className="small text-muted">
                                                            {participant.participant_type?.participant_type || "Participant type not provided"}
                                                        </div>
                                                        {participant.section?.section_name && (
                                                            <div className="small text-muted">
                                                                {participant.section.section_name}
                                                            </div>
                                                        )}
                                                        <div className="d-flex gap-2 mt-2 flex-wrap justify-content-center">
                                                            {participant.participant_type?.adult && (
                                                                <span className="badge rounded-pill text-bg-secondary">Adult</span>
                                                            )}
                                                            {participant.participant_type?.uniformed && (
                                                                <span className="badge rounded-pill text-bg-secondary">Uniformed</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="card-text">{resolvedDescription}</p>
                                    <p className="card-text mb-0">
                                        Need to make changes?{" "}
                                        <a href={`/edit/${entry.id}`}>{editLinkText}</a>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default RegistrationConfirmation;
