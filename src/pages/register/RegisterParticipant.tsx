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

function getTypeLabel(
    participantTypeList: CategorisedParticipantType[],
    participantTypeId: string,
): string {
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
    const [selectedType, setSelectedType] = useState<string>(participant.participant_type_id ?? "");
    const [selectedTypeLabel, setSelectedTypeLabel] = useState<string>("");
    const [selectedSection, setSelectedSection] = useState<string>(participant.section_id ?? "");
    const [firstName, setFirstName] = useState<string>(participant.first_name ?? "");
    const [lastName, setLastName] = useState<string>(participant.last_name ?? "");
    const [participantTypeList, setParticipantTypeList] = useState<CategorisedParticipantType[]>([]);
    const [sectionList, setSectionList] = useState<GroupedSection[]>(transformToSections(sections));
    const [enableSection, setEnableSection] = useState<boolean>(true);
    const [requireSection, setRequireSection] = useState<boolean>(false);

    useEffect(() => {
        setParticipantTypeList(transformToTypes(participantTypes))
    }, [participantTypes]);

    useEffect(() => {
        setFirstName(participant.first_name ?? "");
        setLastName(participant.last_name ?? "");
        setSelectedType(participant.participant_type_id ?? "");
        setSelectedSection(participant.section_id ?? "");
    }, [participant]);

    useEffect(() => {
        if (selectedType) {
            setSelectedTypeLabel(getTypeLabel(participantTypeList, selectedType));
        }
    }, [selectedType, participantTypeList]);

    const updateParticipantField = <K extends keyof Participant>(
        field: K,
        value: Participant[K],
    ) => {
        const updatedParticipant = { ...participant, [field]: value };
        onParticipantChange(participantIdx, updatedParticipant);
    };

    const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const participantTypeId = event.target.value;
        updateParticipantField('participant_type_id', participantTypeId);

        setSelectedTypeLabel(getTypeLabel(participantTypeList, event.target.value));
        setSelectedType(event.target.value);

        participantTypeAdjust(
            participantTypes,
            sections,
            event.target.value,
            setEnableSection,
            setSectionList,
            setRequireSection
        )
    };

    const handleSectionChange = (event: ChangeEvent<HTMLSelectElement>) => {
        updateParticipantField('section_id', event.target.value);
        setSelectedSection(event.target.value);
    };

    const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        updateParticipantField('first_name', event.target.value);
        setFirstName(event.target.value);
    }

    const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        updateParticipantField('last_name', event.target.value);
        setLastName(event.target.value);
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
                    <Col className={'px-0 px-md-3'}>
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
                    <Col className={'col-12 px-0 px-md-3'}>
                        <FormLabel>Participant Name</FormLabel>
                    </Col>
                    <Col className={'col-md-6 col-12 py-3 px-0 px-md-3'}>
                        <Form.Control
                            isInvalid={!!handleFieldError('first_name', serverErrors)}
                            value={firstName}
                            placeholder={'First Name'}
                            required id={'participants.' + participantIdx.toString() + '.first_name'}
                            onChange={handleFirstNameChange}
                        />
                        <Form.Control.Feedback type="invalid">{handleFieldError('first_name', serverErrors)}</Form.Control.Feedback>
                    </Col>
                    <Col className={'col-md-6 col-12 py-3 px-0 px-md-3'}>
                        <Form.Control
                            isInvalid={!!handleFieldError('last_name', serverErrors)}
                            value={lastName}
                            placeholder={'Last Name'}
                            required id={'participants.' + participantIdx.toString() + '.last_name'}
                            onChange={handleLastNameChange}
                        />
                        <Form.Control.Feedback type="invalid">{handleFieldError('last_name', serverErrors)}</Form.Control.Feedback>
                    </Col>
                </Row>
                <Row className={'x-visually-hidden mb-3'}>
                    <Col className={'px-0 px-md-3'}>
                        <FormLabel>Section</FormLabel>
                        <Form.Select
                            value={selectedSection}
                            disabled={!enableSection}
                            required={requireSection}
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
