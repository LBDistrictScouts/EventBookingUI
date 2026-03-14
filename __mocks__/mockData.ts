import { ParticipantType, Section, Group } from "../src/data/dataTypes"; // Adjust path as needed

export const baseType: Omit<ParticipantType, "id" | "participant_type" | "category"> = {
    adult: false,
    uniformed: true,
    out_of_district: false,
    deleted: null,
    modified: "",
    created: "",
};

export const baseGroup: Group = {
    id: 'abcd',
    group_name: 'Test',
    visible: true,
    created: "",
    modified: "",
    deleted: null,
};

export const baseParticipantType: ParticipantType = {
    id: 'abcefg',
    participant_type: 'Beaver',
    category: 'Young Person',
    ...baseType,
};

export const baseSection: Section = {
    id: 'test-section-01',
    section_name: 'test_section',
    participant_type_id: 'pa20-osi99-ss',
    participant_type: baseParticipantType,
    group_id: 's08190-2918',
    group: baseGroup,
    osm_section_id: 92810,
    created: "",
    modified: "",
    deleted: null,
};
