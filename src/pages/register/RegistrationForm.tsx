import PrivacyStatement from "./PrivacyStatement.tsx";
import {Accordion, Form, FormControl} from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router";

import {
    CategorisedParticipantType,
    GroupedSection,
    Participant, SavedEntry,
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


interface RegisterFormProps {
    setSavedEntry: (entry: SavedEntry) => void;
}

function RegistrationForm ({setSavedEntry}: RegisterFormProps) {
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [participantTypeList, setParticipantTypeList] = useState<CategorisedParticipantType[]>([]);
    const [sectionList, setSectionList] = useState<GroupedSection[]>([]);
    const [entryName, setEntryName] = useState<string>("");
    const [entryEmail, setEntryEmail] = useState<string>("");
    const [entryMobile, setEntryMobile] = useState<string>("");
    const [serverErrors, setServerErrors] = useState<ServerValidationErrorList>({}); // Store server errors

    const { event_id } = useParams<{ event_id: string }>();

    useEffect(() => {
        Promise.all([getParticipantTypes(), getSections()])
            .then(([types, sections]) => {
                setParticipantTypeList(types);
                setSectionList(sections);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading || !event_id) {
        return <div>Loading...</div>;
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

        const data: Record<string, Participant[]|string|FormDataEntryValue> = {
            event_id: event_id,
            entry_name: entryName,
            entry_email: entryEmail,
            entry_mobile: entryMobile,
            participants,
        };

        return await SubmitEntryData(data, setServerErrors, setSavedEntry)
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
            {/* Display custom validation errors */}
            {errors.length > 0 && (
                <div className="alert alert-danger">
                    <ul>
                        {errors.map((error, index) => (
                            <li className={'alert-warning'} key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="mb-3">
                <FormControl
                    required
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
            <div className="mb-3">
                <FormControl
                    required
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
                        participantTypeList={participantTypeList}
                        sectionList={sectionList}
                        onParticipantChange={handleParticipantChange}
                        serverErrors={getParticipantServerErrors(index, serverErrors)}
                        removeParticipant={() => handleRemoveParticipant(index)} // ✅ Pass function
                    />
                ))}
            </Accordion>
            <PrivacyStatement />
            <div className="my-3">
                <button className="btn btn-primary d-block btn-user w-100" type="submit">Register
                    for Walk
                </button>
            </div>
        </Form>
    )
}

export default RegistrationForm;