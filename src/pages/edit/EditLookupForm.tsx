import { FormEvent, ReactElement, useState } from "react";
import {Container, Row, Col, Card, Form, FormControl, FormLabel, Button, Alert} from "react-bootstrap";
import { handleReferenceNumber, lookupEntry } from "../../data/backend.ts";
import { SavedEntry } from "../../data/dataTypes.ts";
import { isJsonObject, setValidCookie } from "../../data/utilities.ts";

interface EditLookupFormProps {
    onEntryLoaded: (entry: SavedEntry) => void;
}

function EditLookupForm({ onEntryLoaded }: EditLookupFormProps): ReactElement {
    const [securityCode, setSecurityCode] = useState<string>("");
    const [referenceNumber, setReferenceNumber] = useState<string>("");
    const [invalid, setInvalid] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!referenceNumber.trim() || !securityCode.trim()) {
            setInvalid("One or both fields are empty.");
            return;
        }

        setLoading(true);
        setInvalid("");
        try {
            const entry = await lookupEntry({
                reference_number: handleReferenceNumber(referenceNumber),
                security_code: securityCode,
            });

            if (entry && isJsonObject<SavedEntry>(entry)) {
                setValidCookie("entry", JSON.stringify(entry));
                onEntryLoaded(entry);
                return;
            }

            setInvalid("Reference number & security code combination is invalid!");
        } catch (error) {
            console.error("Lookup failed:", error);
            setInvalid("A server error occurred. Please try again.");
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
                                            <h4 className="text-dark mb-2">Find Your Registration</h4>
                                            <p className="text-muted mb-0">Enter your booking reference and security code to edit your registration.</p>
                                        </div>
                                        {invalid && <Alert variant="danger">{invalid}</Alert>}
                                        <Form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <FormLabel>Reference Number</FormLabel>
                                                <FormControl
                                                    type="text"
                                                    id="reference_number"
                                                    placeholder="123"
                                                    required
                                                    autoComplete="off"
                                                    name="reference_number"
                                                    value={referenceNumber}
                                                    onChange={(e) => {
                                                        setReferenceNumber(e.target.value);
                                                        setInvalid("");
                                                    }}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <FormLabel>Security Code</FormLabel>
                                                <FormControl
                                                    type="text"
                                                    id="security_code"
                                                    placeholder="ABC12"
                                                    required
                                                    autoComplete="off"
                                                    name="security_code"
                                                    value={securityCode}
                                                    onChange={(e) => {
                                                        setSecurityCode(e.target.value);
                                                        setInvalid("");
                                                    }}
                                                />
                                            </div>
                                            <Button className="w-100" type="submit" disabled={loading}>
                                                {loading ? "Finding Registration..." : "Find Registration"}
                                            </Button>
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
    );
}

export default EditLookupForm;
