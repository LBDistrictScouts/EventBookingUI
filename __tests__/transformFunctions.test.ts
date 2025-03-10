import {transformToTypes, transformToSections} from "../src/data/transform"; // Adjust path if needed
import {ParticipantType, Section, Group} from "../src/data/dataTypes"; // Ensure this matches your actual imports

describe("transformToTypes", () => {
    const baseType = {
        adult: false,
        uniformed: true,
        out_of_district: false,
        deleted: null,
        modified: null,
        created: null,
    }

    test("groups participant types correctly", () => {
        const input: ParticipantType[] = [
            {id: 'abcd', participant_type: 'Beaver', category: 'Young Person', ...baseType},
            {id: 'bcde', participant_type: 'Scout', category: 'Young Person', ...baseType},
            {id: 'abcd', participant_type: 'Leader', category: 'Adult', ...baseType},
            {id: 'defg', participant_type: 'Dog', category: 'Animal', ...baseType}
        ];

        const expectedOutput = [
            {
                category: 'Young Person',
                options: [{id: 'abcd', participant_type: 'Beaver'}, {id: 'bcde', participant_type: 'Scout'}]
            },
            {category: 'Adult', options: [{id: 'abcd', participant_type: 'Leader'}]},
            {category: 'Animal', options: [{id: 'defg', participant_type: 'Dog'}]}
        ];

        expect(transformToTypes(input)).toEqual(expectedOutput);
    });

    test("handles empty input array", () => {
        expect(transformToTypes([])).toEqual([]);
    });

    test("handles single category input", () => {
        const input: ParticipantType[] = [
            {id: 'abcd', participant_type: 'Beaver', category: 'Young Person', ...baseType},
            {id: 'bcde', participant_type: 'Scout', category: 'Young Person', ...baseType},
        ];

        const expectedOutput = [
            {category: "Young Person", options: [{id: 'abcd', participant_type: "Beaver"}, {id: 'bcde', participant_type: "Scout"}]}
        ];

        expect(transformToTypes(input)).toEqual(expectedOutput);
    });
});

describe("transformToSections", () => {
    const baseGroup: Group = {
        id: 'abcd',
        group_name: 'Test',
        visible: true,
        created: null,
        modified: null,
        deleted: null,
    }

    const baseParticipantType: ParticipantType = {
        id: 'abcefg',
        participant_type: 'Beaver',
        category: 'Young Person',
        adult: false,
        uniformed: true,
        out_of_district: false,
        deleted: null,
        modified: null,
        created: null,
    }

    const baseSection: Section = {
        id: 'test-section-01',
        section_name: 'test_section',
        participant_type_id: 'pa20-osi99-ss',
        participant_type: baseParticipantType,
        group_id: 's08190-2918',
        group: baseGroup,
        osm_section_id: 92810,
        created: null,
        modified: null,
        deleted: null,
    }

    test("groups sections correctly and sorts them", () => {
        const input: Section[] = [
            {...baseSection, id: 'a123', section_name: '1st Ashwell Beavers', group: {...baseGroup, group_name: '1st Ashwell'}},
            {...baseSection, id: 'b234', section_name: '1st Ashwell Cubs', group: {...baseGroup, group_name: '1st Ashwell'}},
            {...baseSection, id: 'c345', section_name: '1st Ashwell Scouts', group: {...baseGroup, group_name: '1st Ashwell'}},
            {...baseSection, id: 'd456', section_name: '2nd Baldock Scouts', group: {...baseGroup, group_name: '2nd Baldock'}},
        ];

        const expectedOutput = [
            {
                group: "1st Ashwell",
                options: [
                    {id: 'a123', section_name: "1st Ashwell Beavers"},
                    {id: 'b234', section_name: "1st Ashwell Cubs"},
                    {id: 'c345', section_name: "1st Ashwell Scouts"},
                ]
            },
            {
                group: "2nd Baldock",
                options: [
                    {id: 'd456', section_name: "2nd Baldock Scouts"}
                ]
            }
        ];

        expect(transformToSections(input)).toEqual(expectedOutput);
    });

    test("handles empty input array", () => {
        expect(transformToSections([])).toEqual([]);
    });

    test("sorts sections within groups alphabetically", () => {
        const input: Section[] = [
            {...baseSection, id: 'c345', section_name: '1st Ashwell Scouts', group: {...baseGroup, group_name: '1st Ashwell'}},
            {...baseSection, id: 'b234', section_name: '1st Ashwell Cubs', group: {...baseGroup, group_name: '1st Ashwell'}},
            {...baseSection, id: 'a123', section_name: '1st Ashwell Beavers', group: {...baseGroup, group_name: '1st Ashwell'}},
        ];

        const expectedOutput = [
            {
                group: "1st Ashwell",
                options: [
                    {id: 'a123', section_name: "1st Ashwell Beavers"},
                    {id: 'b234', section_name: "1st Ashwell Cubs"},
                    {id: 'c345', section_name: "1st Ashwell Scouts"},
                ]
            }
        ];

        expect(transformToSections(input)).toEqual(expectedOutput);
    });
});