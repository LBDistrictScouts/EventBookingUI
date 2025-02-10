
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

export interface Participant {
    access_key: string;
    first_name: string;
    last_name: string;
    participant_type_id: undefined|string;
    section_id: undefined|string;
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

export interface Entry {
    participants: Participant[];
}

export interface ServerValidationErrorList {
    [key: string]: {
        [key: string]: string|ServerValidationErrorList;
    }
}


export interface EntrySubmissionResponse {
    success: boolean;
    entry: Entry;
    message: string;
    errors: ServerValidationErrorList;
}

export function doesNotHaveKeyInErrors(
    key: string,
    errors: ServerValidationErrorList
): boolean {
    return !(key in errors);
}