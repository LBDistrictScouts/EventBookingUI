import {AccordionBody, AccordionHeader, AccordionItem, Form, FormLabel, Col, Row} from "react-bootstrap";
import {ChangeEvent, ReactElement, useEffect, useState} from "react";
import {Section, ParticipantType, CategorisedParticipantType, GroupedSection, Participant} from '../../data/dataTypes'
import {ServerValidationErrorList} from "../../data/dataTypes";
import {handleFieldError} from "../../data/backend";
import Button from "react-bootstrap/Button";
import {participantTypeAdjust, transformToSections, transformToTypes} from "../../data/transform";

interface RegisterParticipantParams {
    participantIdx: number;
    participant: Participant;
    sections: Section[];
    participantTypes: ParticipantType[];
    onParticipantChange: (index: number, updatedParticipant: Participant) => void;
    serverErrors: ServerValidationErrorList;
    removeParticipant: () => void;
}


export function RegisterParticipant(
    {
        participantIdx,
        participant,
        sections,
        participantTypes,
        onParticipantChange,
        serverErrors,
        removeParticipant,
    }: RegisterParticipantParams): ReactElement
{
    const [selectedType, setSelectedType] = useState<string>("");
    const [selectedTypeLabel, setSelectedTypeLabel] = useState<string>("");
    const [selectedSection, setSelectedSection] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [participantTypeList, setParticipantTypeList] = useState<CategorisedParticipantType[]>([]);
    const [sectionList, setSectionList] = useState<GroupedSection[]>(transformToSections(sections));
    const [enableSection, setEnableSection] = useState<boolean>(true);

    useEffect(() => {
        setParticipantTypeList(transformToTypes(participantTypes))
    }, [participantTypes]);

    const getTypeLabel = (participantTypeId: string): string => {
        for (const category of participantTypeList) {
            const pType = category.options.find(
                (option) => option.id === participantTypeId
            );
            if (pType) {
                return pType.participant_type;
            }
        }

        return "";
    }

    const handleInputChange = (event: ChangeEvent<HTMLSelectElement|HTMLInputElement>) => {
        const { name, value } = event.target;
        const updatedParticipant = { ...participant, [name]: value };
        onParticipantChange(participantIdx, updatedParticipant);
    };

    const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        participant.participant_type_id = event.target.value;
        setSelectedTypeLabel(getTypeLabel(event.target.value));
        setSelectedType(event.target.value);

        participantTypeAdjust(
            participantTypes,
            sections,
            event.target.value,
            setEnableSection,
            setSectionList
        )

        handleInputChange(event);
    };

    const handleSectionChange = (event: ChangeEvent<HTMLSelectElement>) => {
        participant.section_id = event.target.value;
        setSelectedSection(event.target.value);

        handleInputChange(event);
    };

    const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        participant.first_name = event.target.value;
        setFirstName(event.target.value);

        handleInputChange(event);
    }

    const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        participant.last_name = event.target.value;
        setLastName(event.target.value);

        handleInputChange(event);
    }

    return (
        <AccordionItem key={participant.access_key} role={"tab"} eventKey={participantIdx.toString()} >
            <AccordionHeader role={"tab"}>
                {
                    (participant && firstName) ? (
                            (selectedTypeLabel) ? (
                                firstName + ' ' + lastName + ' - ' + selectedTypeLabel
                            ) : (
                                firstName + ' ' + lastName
                            )
                    ) : 'New Participant'
                }
            </AccordionHeader>
            <AccordionBody>
                <Row className={'x-visually-hidden mb-3'}>
                    <Col>
                        <FormLabel>Participant Type</FormLabel>
                        <Form.Select
                            value={selectedType}
                            onChange={handleTypeChange}
                            isInvalid={!!handleFieldError('participant_type', serverErrors)
                        }>
                            <option value="" disabled>
                                Select a Participant Type
                            </option>
                            {(participantTypeList) ? (
                                participantTypeList.map((cat, index) => (
                                    <optgroup label={cat.category} key={index}>
                                        {cat.options.map((option, opt_index: number) => (
                                            <option value={option.id} key={opt_index}>
                                                {option.participant_type}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))
                            ) : ''}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{handleFieldError('participant_type', serverErrors)}</Form.Control.Feedback>
                    </Col>
                </Row>
                <Row className={'mb-3'}>
                    <Col className={'col-12'}>
                        <FormLabel>Participant Name</FormLabel>
                    </Col>
                    <Col className={'col-6'}>
                        <Form.Control
                            isInvalid={!!handleFieldError('first_name', serverErrors)}
                            placeholder={'First Name'}
                            required id={'participants.' + participantIdx.toString() + '.first_name'}
                            onChange={handleFirstNameChange}
                        />
                        <Form.Control.Feedback type="invalid">{handleFieldError('first_name', serverErrors)}</Form.Control.Feedback>
                    </Col>
                    <Col className={'col-6'}>
                        <Form.Control
                            isInvalid={!!handleFieldError('last_name', serverErrors)}
                            placeholder={'Last Name'}
                            required id={'participants.' + participantIdx.toString() + '.last_name'}
                            onChange={handleLastNameChange}
                        />
                        <Form.Control.Feedback type="invalid">{handleFieldError('last_name', serverErrors)}</Form.Control.Feedback>
                    </Col>
                </Row>
                <Row className={'x-visually-hidden mb-3'}>
                    <Col>
                        <FormLabel>Section</FormLabel>
                        <Form.Select
                            value={selectedSection}
                            disabled={!enableSection}
                            onChange={handleSectionChange}>
                            <option value="" disabled>
                                Select a Section
                            </option>
                            {(sectionList) ? (
                                sectionList.map((section, index) => (
                                    <optgroup label={section.group} key={index}>
                                        {section.options.map((option, opt_index: number) => (
                                            <option value={option.id} key={opt_index}>
                                                {option.section_name}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))
                            ) : ''}
                        </Form.Select>
                    </Col>
                </Row>
                <Row>
                    <Col content={'right'}>
                        <Button variant="danger" size="sm" onClick={removeParticipant}>Remove Participant</Button>
                    </Col>
                </Row>
            </AccordionBody>
        </AccordionItem>
    )

}

