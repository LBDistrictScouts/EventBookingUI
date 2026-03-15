import {FormEvent, ReactElement, useState} from "react";
import {Alert, Card, Col, Container, Form, FormCheck, Row} from "react-bootstrap";
import {Checkpoint, PersistedEntry} from "../../data/dataTypes.ts";
import CheckpointHeader from "./CheckpointHeader.tsx";
import {submitCheckIn} from "../../data/backend.ts";
import ClearButton from "./ClearButton.tsx";

interface CheckInFormProps {
    setLoading: CallableFunction
    setComplete: CallableFunction
    setError: CallableFunction
    entry: PersistedEntry
    setEntry: CallableFunction
    checkpoint: Checkpoint;
}


function CheckInForm({ setLoading, setComplete, setError, entry, setEntry,checkpoint}: CheckInFormProps): ReactElement {
    const [participantList, setParticipantList] = useState<string[]>([]);
    const [warning, setWarning] = useState<string>('');

    const onCheckInChange = (participantId: string, checked: boolean) => {
        setParticipantList((prev) => {
            setWarning('')
            return checked
                ? [...new Set([...prev, participantId])]
                : prev.filter((id) => id !== participantId);
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (participantList.length === 0) {
            setLoading(false);

            setWarning('No participants have been selected.');

            return;
        }

        setLoading(true);
        try {
            const formData = {
                entry_id: entry.id,
                checkpoint_id: checkpoint.id,
                participants: participantList
            }

            const response = await submitCheckIn(formData)

            setComplete(response);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <Container>
            <Row className={'justify-content-center'}>
                <Col md={9} lg={12} xl={10}>
                    <Card className={'shadow-lg o-hidden border-0 my-5'}>
                        <Card.Body className={'p-0'}>
                            <Row>
                                <Col lg={6}>
                                    <div className="p-5">
                                        <div className="text-center">
                                            <CheckpointHeader checkpoint={checkpoint} />
                                            <p className={'mb-0'}>Booking Reference</p>
                                            <p className="fs-1">{entry.reference_number}</p>
                                        </div>
                                        {warning && <Alert variant="warning">{warning}</Alert>}
                                        <Form onSubmit={handleSubmit}>
                                            {entry.participants.map((participant) => (
                                                <Form.Group key={participant.id} className="mb-2 d-flex align-items-center">
                                                    <FormCheck
                                                        type="checkbox"
                                                        id={`checkin-${participant.id}`}
                                                        checked={participantList.includes(participant.id)}
                                                        onChange={(e) =>
                                                            onCheckInChange(participant.id, e.target.checked)
                                                        }
                                                    />
                                                    <Form.Label
                                                        htmlFor={`checkin-${participant.id}`}
                                                        className="ms-2 mb-0"
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {participant.full_name}
                                                    </Form.Label>
                                                </Form.Group>
                                            ))}

                                            <div className="mb-3">
                                                <div className="custom-control custom-checkbox small"></div>
                                            </div>
                                            <button className="btn btn-primary d-block btn-user w-100" type="submit">
                                                Submit
                                            </button>
                                        </Form>

                                        <div className={'my-5'} >
                                            <hr/>
                                        </div>

                                        <ClearButton setEntry={setEntry} />
                                    </div>
                                </Col>
                                <Col className="d-flex">
                                    <div className="flex-grow-1 bg-login-image"></div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )

}

export default CheckInForm;
