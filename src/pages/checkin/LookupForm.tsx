import {FormEvent, ReactElement, useState} from "react";
import {Container, Row, Col, Card, Form, FormControl, FormLabel} from "react-bootstrap";
import {handleReferenceNumber, lookupEntry, storeEntry} from "../../data/backend.ts";
import {Checkpoint} from "../../data/dataTypes.ts";
import CheckpointHeader from "./CheckpointHeader.tsx";


interface CheckInFormProps {
    setLoading: CallableFunction
    setEntry: CallableFunction
    checkpoint: Checkpoint;
}


function LookupForm({setLoading, setEntry, checkpoint}: CheckInFormProps): ReactElement {
    const [securityCode, setSecurityCode] = useState<string>('');
    const [referenceNumber, setReferenceNumber] = useState<string>('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        try {
            const entry = await lookupEntry({
                reference_number: handleReferenceNumber(referenceNumber),
                security_code: securityCode,
            });

            storeEntry(entry);
            setEntry(entry);
        } catch (error) {
            console.error("Error fetching entry:", error);
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
                                        <Form onSubmit={handleSubmit}>
                                            <div className="mb-3 text-reset">
                                                <FormLabel>Reference Number</FormLabel>
                                                <FormControl
                                                    type="text"
                                                    id="reference_number"
                                                    placeholder="123"
                                                    name="reference_number"
                                                    value={referenceNumber}
                                                    onChange={(e) => setReferenceNumber(e.target.value)}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <FormLabel className={'text-start'}>Security Code</FormLabel>
                                                <FormControl
                                                    type="text"
                                                    id="security_code"
                                                    placeholder="ABCEF"
                                                    name="security_code"
                                                    value={securityCode}
                                                    onChange={(e) => setSecurityCode(e.target.value)}
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