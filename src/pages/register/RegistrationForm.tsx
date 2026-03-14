import PrivacyStatement from "./PrivacyStatement.tsx";
import {Accordion, Alert, Form, FormControl} from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router";

import {
    ParticipantType,
    Section,
    Participant, SavedEntry, SavedParticipant,
    ServerValidationErrorList
} from '../../data/dataTypes.ts'
import {RegisterParticipant} from './RegisterParticipant.tsx'
import {useEffect, useState} from "react";
import {
    getParticipantServerErrors,
    getParticipantTypes,
    getSections,
    handleFieldError,
    SubmitEntryData
} from "../../data/backend.ts";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import InputHelper from '../../layout/text/InputHelper.tsx'
import * as React from "react";
import LoadingScreen from "../../LoadingScreen.tsx";


interface RegisterFormProps {
    setSavedEntry: (entry: SavedEntry) => void;
    initialEntry?: SavedEntry;
    mode?: "create" | "edit";
    eventIdOverride?: string;
}

function mapSavedParticipantToParticipant(participant: SavedParticipant): Participant {
    return {
        access_key: participant.id,
        first_name: participant.first_name ?? "",
        last_name: participant.last_name ?? "",
        participant_type_id: participant.participant_type_id ?? undefined,
        section_id: participant.section_id ?? undefined,
        participant_type: undefined,
        section: undefined,
    };
}

function RegistrationForm ({
    setSavedEntry,
    initialEntry,
    mode = "create",
    eventIdOverride,
}: RegisterFormProps) {
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [participants, setParticipants] = useState<Participant[]>(
        initialEntry ? initialEntry.participants.map(mapSavedParticipantToParticipant) : []
    );
    const [participantTypes, setParticipantTypes] = useState<ParticipantType[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [entryName, setEntryName] = useState<string>(initialEntry?.entry_name ?? "");
    const [entryEmail, setEntryEmail] = useState<string>(initialEntry?.entry_email ?? "");
    const [entryMobile, setEntryMobile] = useState<string>(initialEntry?.entry_mobile ?? "");
    const [privacyAcknowledged, setPrivacyAcknowledged] = useState<boolean>(false);
    const [singleParticipantWarningVisible, setSingleParticipantWarningVisible] = useState<boolean>(false);
    const [singleParticipantWarningDismissed, setSingleParticipantWarningDismissed] = useState<boolean>(false);
    const [serverErrors, setServerErrors] = useState<ServerValidationErrorList>({}); // Store server errors

    const { event_id } = useParams<{ event_id: string }>();

    useEffect(() => {
        Promise.all([getParticipantTypes(), getSections()])
            .then(([types, sections]) => {
                setParticipantTypes(types);
                setSections(sections);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (participants.length !== 1) {
            setSingleParticipantWarningVisible(false);
            setSingleParticipantWarningDismissed(false);
        }
    }, [participants.length]);

    const targetEventId = eventIdOverride ?? event_id;

    if (loading || !targetEventId) {
        return <LoadingScreen />;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;
        if (!form.checkValidity()) {
            setValidated(true);
            return;
        }

        setErrors([]);
        if (participants.length < 1) {
            setErrors(["At least one participant is required."]);
            return;
        }
        if (participants.length === 1 && !singleParticipantWarningDismissed) {
            setSingleParticipantWarningVisible(true);
            return;
        }

        const data: Record<string, Participant[]|string|FormDataEntryValue> = {
            event_id: targetEventId,
            entry_name: entryName,
            entry_email: entryEmail,
            entry_mobile: entryMobile,
            participants,
        };
        if (mode === "edit" && initialEntry?.id) {
            data.entry_id = initialEntry.id;
        }

        setLoading(true);
        const response = await SubmitEntryData(data, setServerErrors, setSavedEntry)
            .finally(() => setLoading(false));

        return response;
    };

    const handleAddParticipant = () => {
        setParticipants(prev => [...prev, {
            access_key: uuidv4(),
            first_name: "",
            last_name: "",
            participant_type_id: undefined,
            section_id: undefined,
            participant_type: undefined,
            section: undefined
        }]);
    };

    const handleRemoveParticipant = (index: number) => {
        setParticipants(prev => prev.filter((_, i) => i !== index));
    };

    const handleParticipantChange = (index: number, updatedParticipant: Participant) => {
        setParticipants((prevParticipants) => {
            const newParticipants = [...prevParticipants];
            newParticipants[index] = updatedParticipant;
            return newParticipants;
        });
    };

    return (
        <Form validated={validated} onSubmit={handleSubmit} className={'user'}>
            <div className="mb-3">
                <FormControl
                    required
                    value={entryName}
                    onChange={(e) => setEntryName(e.target.value)}
                    isInvalid={!!handleFieldError("entry_name", serverErrors)}
                    className="form-control-user"
                    type="text"
                    aria-describedby="groupHelp"
                    placeholder="Walking Group Name"
                    name="entry_name"
                />
                <Form.Control.Feedback type="invalid" >
                    {handleFieldError("entry_name", serverErrors)}
                </Form.Control.Feedback>
                <InputHelper text={'All members of your walking party must be registered on the same booking form.'} />
            </div>
            {mode === "create" && (
                <>
                    <div className="mb-3">
                        <FormControl
                            required
                            value={entryEmail}
                            onChange={(e) => setEntryEmail(e.target.value)}
                            isInvalid={!!handleFieldError("entry_email", serverErrors)}
                            className="form-control-user"
                            type={'email'}
                            aria-describedby="emailHelp"
                            placeholder="Email Address"
                            name="entry_email"
                        />
                        <Form.Control.Feedback type="invalid">
                            {handleFieldError("entry_email", serverErrors)}
                        </Form.Control.Feedback>
                        <InputHelper text={'We need an email to send your booking confirmation and security code. We will also use it to send a reminder just before the event.'} />
                    </div>
                    <div className="mb-3">
                        <FormControl
                            id={'entry_mobile'}
                            required
                            value={entryMobile}
                            onChange={(e) => setEntryMobile(e.target.value)}
                            isInvalid={!!handleFieldError("entry_mobile", serverErrors)}
                            className="form-control-user"
                            type={'tel'}
                            placeholder="Mobile Number"
                            name={'entry_mobile'}
                        />
                        <Form.Control.Feedback type="invalid">
                            {handleFieldError("entry_mobile", serverErrors)}
                        </Form.Control.Feedback>
                        <InputHelper text={'We need a contact phone number for on the day, in case you are late back or there is an issue.'} />
                    </div>
                </>
            )}
            <Row>
                <Col className="text-end mb-3">
                    <Button variant={'outline-secondary'} onClick={handleAddParticipant} size={'sm'}>
                        Add Participant
                    </Button>
                </Col>
            </Row>
            <Accordion role={"tablist"} id={'accordion-1'} className="mb-3" defaultActiveKey="0">
                {participants.map((participant: Participant, index: number) => (
                    <RegisterParticipant
                        key={participant.access_key}
                        participantIdx={index}
                        participant={participant}
                        participantTypes={participantTypes}
                        sections={sections}
                        onParticipantChange={handleParticipantChange}
                        serverErrors={getParticipantServerErrors(index, serverErrors)}
                        removeParticipant={() => handleRemoveParticipant(index)} // ✅ Pass function
                    />
                ))}
            </Accordion>
            <PrivacyStatement
                acknowledged={privacyAcknowledged}
                onAcknowledge={() => setPrivacyAcknowledged(true)}
            />
            {/* Display custom validation errors */}
            {errors.length > 0 && (
                <>
                    {errors.map((error, index) => (
                        <div className="alert alert-danger text-center mb-3" role="alert" key={index}>
                            <p className="mb-0">{error}</p>
                        </div>
                    ))}
                </>
            )}
            {singleParticipantWarningVisible && (
                <Alert
                    dismissible
                    variant="warning"
                    onClose={() => {
                        setSingleParticipantWarningVisible(false);
                        setSingleParticipantWarningDismissed(true);
                    }}
                >
                    <p>This registration contains only one participant.</p>

                    <p>Please register as a team, this will mean that you can check in together, rather than having to do so individually.</p>

                    <p>Only adults can walk alone, all young people must be registered as part of a team.</p>

                    <p>
                        If you want to add a participant after registering,{" "}
                        <a href="/edit">please edit the registration</a>.
                    </p>
                </Alert>
            )}
            <div className="my-3">
                <button
                    className="btn btn-primary d-block btn-user w-100"
                    type="submit"
                    disabled={!privacyAcknowledged}
                >
                    {mode === "edit" ? "Save Registration Changes" : "Register for Walk"}
                </button>
            </div>
        </Form>
    )
}

export default RegistrationForm;
