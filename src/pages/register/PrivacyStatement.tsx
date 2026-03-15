import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";

interface PrivacyStatementProps {
    acknowledged: boolean;
    onAcknowledge: () => void;
}

function PrivacyStatement({ acknowledged, onAcknowledge }: PrivacyStatementProps) {
    const [showModal, setShowModal] = useState(false);
    const [modalChecked, setModalChecked] = useState(false);

    const handleAcknowledge = () => {
        onAcknowledge();
        setModalChecked(false);
        setShowModal(false);
    };

    const openModal = () => {
        setModalChecked(acknowledged);
        setShowModal(true);
    };

    return (
        <div className="my-3">
            {acknowledged ? (
                <div className="mb-2 py-1">
                    <div className="d-flex flex-column flex-sm-row align-items-center text-center text-sm-start gap-2">
                        <Form.Check
                            id="privacy-acknowledged"
                            type="checkbox"
                            checked
                            readOnly
                            label="GDPR & Privacy use statement acknowledged."
                            className="mb-0"
                        />
                        <Button className="ms-sm-auto" variant="outline-success" size="sm" onClick={openModal}>
                            Review statement
                        </Button>
                    </div>
                </div>
            ) : (
                <Alert variant="warning" className="mb-2">
                    <div className="d-flex flex-column flex-sm-row align-items-center text-center text-sm-start gap-2">
                        <span>GDPR &amp; Privacy statement not yet acknowledged.</span>
                        <Button className="ms-sm-auto" variant="warning" size="sm" onClick={openModal}>
                            Review statement
                        </Button>
                    </div>
                </Alert>
            )}

            {/* modal remains unchanged */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>GDPR &amp; Privacy use statement.</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-3">
                        Personally Identifiable Information (PII) is recognised as email addresses, phone numbers
                        and participant names.
                    </p>
                    <p className="mb-3">
                        Email addresses and telephone numbers will be purged within 10 days of the event. A secure
                        signature of the email address will be persisted for statistical purposes to allow repeat sign
                        ups to be monitored over multiple years. Email addresses will only be used to send
                        transactional notifications.
                    </p>
                    <p className="mb-3">
                        Participant names will be shared with section leaders prior, during and following the event
                        for legitimate purpose, including badge requirement validations, invoicing support and Scout
                        Association membership context.
                    </p>
                    <p className="mb-0">
                        Registering for the walk grants the use of personal data in accordance with the above stated
                        usage and timelines.
                    </p>
                    {!acknowledged && (
                        <Form.Check
                            id="privacy-modal-confirm"
                            className="mt-3"
                            type="checkbox"
                            checked={modalChecked}
                            onChange={(event) => setModalChecked(event.currentTarget.checked)}
                            label="I have reviewed and accept this GDPR & Privacy use statement."
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Close</Button>
                    {!acknowledged && (
                        <Button variant="primary" onClick={handleAcknowledge} disabled={!modalChecked}>
                            Confirm
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default PrivacyStatement;
