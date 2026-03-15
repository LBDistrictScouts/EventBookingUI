import { ReactElement, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Alert } from "react-bootstrap";
import { PersistedEntry } from "../../data/dataTypes.ts";
import { isJsonObject } from "../../data/utilities.ts";
import { getEntry, getSavedEntry, isSavedEntry, persistEntry, preferSavedEntry } from "../../data/backend.ts";
import RegistrationConfirmation from "../register/RegistrationConfirmation.tsx";
import RegistrationForm from "../register/RegistrationForm.tsx";
import EditLookupForm from "./EditLookupForm.tsx";
import ClearButton from "../checkin/ClearButton.tsx";
import LoadingScreen from "../../LoadingScreen.tsx";

function EditRegister(): ReactElement {
    const { entry_id } = useParams<{ entry_id: string }>();
    const navigate = useNavigate();
    const [savedEntry, setSavedEntry] = useState<PersistedEntry | undefined>(() => getSavedEntry(entry_id));
    const [loading, setLoading] = useState<boolean>(() => !getSavedEntry(entry_id) && !!entry_id);
    const [loadError, setLoadError] = useState<string>("");
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

    useEffect(() => {
        if (isJsonObject<PersistedEntry>(savedEntry)) {
            persistEntry(savedEntry);
        }
    }, [savedEntry]);

    useEffect(() => {
        if (savedEntry || !entry_id) {
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setLoadError("");

        getEntry(entry_id)
            .then((entry) => {
                if (cancelled) {
                    return;
                }

                const preferredEntry = preferSavedEntry(entry_id, entry);

                if (preferredEntry && isJsonObject<PersistedEntry>(preferredEntry)) {
                    setShowConfirmation(false);
                    setSavedEntry(preferredEntry);
                    return;
                }

                setLoadError("Registration not found.");
            })
            .catch((error) => {
                console.error("Failed to load entry by id:", error);
                if (!cancelled) {
                    setLoadError("A server error occurred. Please try again.");
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [entry_id, savedEntry]);

    const handleEntryLoaded = (entry: PersistedEntry) => {
        setShowConfirmation(false);
        setSavedEntry(entry);
        navigate(`/edit/${entry.id}`, { replace: true });
    };

    const handleEntrySaved = (entry: PersistedEntry) => {
        const preferredEntry = preferSavedEntry(entry.id, entry);
        const currentSavedEntry = isSavedEntry(savedEntry) && savedEntry.id === entry.id
            ? savedEntry
            : undefined;

        setSavedEntry(currentSavedEntry || preferredEntry || entry);
        setShowConfirmation(true);
    };

    if (loading) {
        return <LoadingScreen />;
    }

    if (!savedEntry) {
        return (
            <>
                {loadError && <Alert variant="danger">{loadError}</Alert>}
                <EditLookupForm onEntryLoaded={handleEntryLoaded} />
            </>
        );
    }

    if (showConfirmation) {
        return (
            <RegistrationConfirmation
                entry={savedEntry}
                title="Registration Updated"
                description={isSavedEntry(savedEntry)
                    ? "Your registration changes have been saved. You will need the booking reference and security code to register on the day of the walk."
                    : "Your registration changes have been saved. Keep your booking reference to hand for the day of the walk."}
                editLinkText="Edit this registration again"
            />
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
                                setSavedEntry={handleEntrySaved}
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
