
interface BackEndObject {
    id: string;
    created: string;
    modified: string;
    deleted: null|string;
}


export interface ParticipantType extends BackEndObject {
    participant_type: string;
    category: string;
    adult: boolean;
    uniformed: boolean;
    out_of_district: boolean;
}

export interface Group extends BackEndObject {
    "group_name": string;
    "visible": boolean;
}

export interface Section extends BackEndObject {
    section_name: string;
    participant_type_id: string;
    group_id: string;
    osm_section_id: number;
    group: Group;
    participant_type: ParticipantType;
}

export interface BaseParticipant {
    first_name: string;
    last_name: string;
    participant_type_id: undefined|string;
    section_id: undefined|string;
}

export interface SavedParticipant extends BaseParticipant {
    id: string;
    entry_id: string;
    created: string;
    modified: string;
}

export interface Participant extends BaseParticipant {
    access_key: string;
    participant_type: undefined|ParticipantType;
    section: undefined|Section;
}

export interface ParticipantTypesDataResponse {
    participantTypes: ParticipantType[]
}

export interface CategorisedParticipantType {
    category: string;
    options: {
        id: string;
        participant_type: string
    }[];
}

export interface SectionsDataResponse {
    sections: Section[];
}

export interface GroupedSection {
    group: string;
    options: {
        id: string;
        section_name: string
    }[];
}

export interface BaseEntry {
    event_id: string;
    entry_name: string;
    entry_email: string;
    entry_mobile: string;
}

export interface SavedEntry extends BaseEntry {
    id: string;
    security_code: string;
    created: string;
    modified: string;
    participants: SavedParticipant[];
}

export interface ServerValidationErrorList {
    [key: string]: {
        [key: string]: string|ServerValidationErrorList;
    }
}


export interface EntrySubmissionResponse {
    success: boolean;
    entry: SavedEntry;
    message: string;
    errors: ServerValidationErrorList;
}

export function doesNotHaveKeyInErrors(
    key: string,
    errors: ServerValidationErrorList
): boolean {
    return !(key in errors);
}

export interface Checkpoint {
    checkpoint_sequence: number;
    checkpoint_name: string;
    event_id: string;
}

export interface Question {
    event_id: string;
    question_text: string;
    answer_text: string;
}

export interface BookableEvent {
    id: string;
    event_name: string;
    event_description: string;
    booking_code: string;
    start_time: string;
    bookable: boolean;
    finished: boolean;
    checkpoints: Checkpoint[];
    questions: Question[];
    sections: Section[];
}

export interface BookableEventResponse {
    event: BookableEvent;
}