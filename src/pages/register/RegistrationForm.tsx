import PrivacyStatement from "./PrivacyStatement.tsx";
import {Accordion, Form, FormControl} from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import {
    CategorisedParticipantType,
    GroupedSection,
    Participant,
    ServerValidationErrorList
} from '../../data/dataTypes.ts'
import {RegisterParticipant} from './RegisterParticipant.tsx'
import {ChangeEvent, useEffect, useState} from "react";
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


function RegistrationForm () {
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [participantTypeList, setParticipantTypeList] = useState<CategorisedParticipantType[]>([]);
    const [sectionList, setSectionList] = useState<GroupedSection[]>([]);
    const [entry_name, setEntryName] = useState<string>("");
    const [entry_email, setEntryEmail] = useState<string>("");
    const [serverErrors, setServerErrors] = useState<ServerValidationErrorList>({}); // Store server errors

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;

        // Reset errors
        setErrors([]);

        if (!form.checkValidity()) {
            setValidated(true);
            return;
        }

        // Custom validation
        const customErrors = [];
        if (participants.length < 1) {
            customErrors.push("At least one participant is required.");
        }

        if (customErrors.length > 0) {
            setErrors(customErrors);
            return;
        }

        // Convert form data to JSON
        const formData = new FormData(form);

        const data: Record<string, Participant[]|string|FormDataEntryValue> = {
            event_id: '339b303b-b847-4610-b3a3-990c10afe4e8',
            entry_name,
            entry_email,
        };

        data['participants'] = participants;

        formData.forEach((value, key) => {
            data[key] = value;
        });

        console.log(data)

        await SubmitEntryData(data, setServerErrors)
    };

    const makeNewParticipant = (): Participant => {
        return {
            access_key: uuidv4(),
            first_name: "",
            last_name: "",
            participant_type_id: undefined,
            section_id: undefined,
            participant_type: undefined,
            section: undefined
        };
    }

    const handleAddParticipant = (): void => {
        setParticipants((prevParticipants) => [
            ...prevParticipants,
            makeNewParticipant(),
        ]);
    }

    useEffect(() => {
        Promise.all([getParticipantTypes(), getSections()])
            .then(([types, sections]) => {
                setParticipantTypeList(types);
                setSectionList(sections);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleParticipantChange = (index: number, updatedParticipant: Participant) => {
        setParticipants((prevParticipants) => {
            const newParticipants = [...prevParticipants];
            newParticipants[index] = updatedParticipant;
            return newParticipants;
        });
    };

    const handleEntryNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEntryName(event.target.value);
    };

    const handleEntryEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEntryEmail(event.target.value);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Form validated={validated} onSubmit={handleSubmit} className={'user'} >
            {/* Display custom validation errors */}
            {errors.length > 0 && (
                <div className="alert alert-danger">
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="mb-3">
                <FormControl
                    required
                    onChange={handleEntryNameChange}
                    isInvalid={!!handleFieldError("entry_name", serverErrors)}
                    className="form-control-user"
                    type="text"
                    aria-describedby="groupHelp"
                    placeholder="Walking Group Name"
                    name="entry_name"
                />
                <Form.Control.Feedback type="invalid">
                    {handleFieldError("entry_name", serverErrors)}
                </Form.Control.Feedback>
            </div>
            <div className="mb-3">
                <FormControl
                    required
                    onChange={handleEntryEmailChange}
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
            </div>
            <Row>
                <Col className="text-end mb-3">
                    <Button variant={'outline-secondary'} onClick={handleAddParticipant} size={'sm'}>
                        Add Participant
                    </Button>
                </Col>
            </Row>
            <Accordion role={"tablist"} id={'accordion-1'} className="mb-3" defaultActiveKey="0">
                {
                    participants.map((participant: Participant, index: number) => {
                        return (
                            <RegisterParticipant
                                key={participant.access_key}
                                participantIdx={index}
                                participant={participant}
                                participantTypeList={participantTypeList}
                                sectionList={sectionList}
                                onParticipantChange={handleParticipantChange}
                                serverErrors={getParticipantServerErrors(index, serverErrors)}
                            />
                        );
                    })
                }
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