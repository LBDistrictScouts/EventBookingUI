import {FormEvent, ReactElement, useState} from "react";
import {Container, Row, Col, Card, Form, FormControl, FormLabel, Alert} from "react-bootstrap";
import {handleReferenceNumber, lookupEntry, storeEntry} from "../../data/backend.ts";
import {Checkpoint, PersistedEntry} from "../../data/dataTypes.ts";
import CheckpointHeader from "./CheckpointHeader.tsx";
import {isJsonObject} from "../../data/utilities.ts";


interface CheckInFormProps {
    setLoading: CallableFunction
    setEntry: CallableFunction
    checkpoint: Checkpoint;
    invalid: string;
    setInvalid: CallableFunction;
}


function LookupForm({setLoading, setEntry, checkpoint, invalid, setInvalid}: CheckInFormProps): ReactElement {
    const [securityCode, setSecurityCode] = useState<string>('');
    const [referenceNumber, setReferenceNumber] = useState<string>('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        if (!referenceNumber.trim() || !securityCode.trim()) {
            setInvalid('One or both fields are empty.');
            setLoading(false);
            return;
        }

        try {
            const entry = await lookupEntry({
                reference_number: handleReferenceNumber(referenceNumber),
                security_code: securityCode,
            });

            if (entry && isJsonObject<PersistedEntry>(entry)) {
                storeEntry(entry);
                setEntry(entry);
                setLoading(false);

                return;
            } else {
                console.error("LookupForm error", referenceNumber, securityCode);
                setInvalid('Reference number & security code combination is invalid!');
            }
        } catch (error) {
            console.error("Error fetching entry:", error);
            setInvalid('A server error occurred. Please try again.');
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
                                        </div>
                                        {invalid && <Alert variant="danger">{invalid}</Alert>}
                                        <Form onSubmit={handleSubmit}>
                                            <div className="mb-3 text-reset">
                                                <FormLabel>Reference Number</FormLabel>
                                                <FormControl
                                                    type="text"
                                                    autoFocus={true}
                                                    id="reference_number"
                                                    placeholder="123"
                                                    required={true}
                                                    name="reference_number"
                                                    value={referenceNumber}
                                                    onChange={(e) => {
                                                        setReferenceNumber(e.target.value)
                                                        setInvalid('')
                                                    }}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <FormLabel className={'text-start'}>Security Code</FormLabel>
                                                <FormControl
                                                    type="text"
                                                    id="security_code"
                                                    placeholder="ABCEF"
                                                    required={true}
                                                    name="security_code"
                                                    value={securityCode}
                                                    onChange={(e) => {
                                                        setSecurityCode(e.target.value)
                                                        setInvalid('')
                                                    }}
                                                />
                                            </div>
                                            <button className="btn btn-primary d-block btn-user w-100"
                                                    type="submit">Submit
                                            </button>
                                        </Form>
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

export default LookupForm;
