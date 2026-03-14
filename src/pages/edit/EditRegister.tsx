import { ReactElement, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { SavedEntry } from "../../data/dataTypes.ts";
import { isJsonObject, setValidCookie } from "../../data/utilities.ts";
import { getSavedEntry } from "../../data/backend.ts";
import RegistrationForm from "../register/RegistrationForm.tsx";
import EditLookupForm from "./EditLookupForm.tsx";
import ClearButton from "../checkin/ClearButton.tsx";

function EditRegister(): ReactElement {
    const { entry_id } = useParams<{ entry_id: string }>();
    const navigate = useNavigate();
    const [savedEntry, setSavedEntry] = useState<SavedEntry | undefined>(getSavedEntry());

    useEffect(() => {
        if (isJsonObject<SavedEntry>(savedEntry)) {
            setValidCookie("entry", savedEntry);
        }
    }, [savedEntry]);

    const hasEditableEntry = !!savedEntry && (!entry_id || savedEntry.id === entry_id);

    const handleEntryLoaded = (entry: SavedEntry) => {
        setSavedEntry(entry);
        navigate(`/edit/${entry.id}`, { replace: true });
    };

    if (!hasEditableEntry) {
        return (
            <EditLookupForm onEntryLoaded={handleEntryLoaded} />
        );
    }

    return (
        <Card border={"0"} className={"shadow-lg p-0 o-hidden my-5"}>
            <Card.Body className={"p-0"}>
                <Row>
                    <Col lg={5} d={"none"} className={"col-lg-5 d-none d-lg-flex"}>
                        <div className="flex-grow-1 bg-register-image"></div>
                    </Col>
                    <Col lg={7}>
                        <div className="p-3 p-lg-5">
                            <div className="text-center">
                                <h4 className="text-dark mb-4">Edit Registration</h4>
                            </div>
                            <RegistrationForm
                                mode="edit"
                                initialEntry={savedEntry}
                                eventIdOverride={savedEntry.event_id}
                                setSavedEntry={setSavedEntry}
                            />
                            <hr />
                            <ClearButton setEntry={setSavedEntry} buttonText={'Clear Screen & Lookup New Form'} />
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default EditRegister;
