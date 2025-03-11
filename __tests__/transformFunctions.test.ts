import {transformToTypes, transformToSections} from "../src/data/transform";
import {ParticipantType, Section} from "../src/data/dataTypes";
import { baseType, baseSection, baseGroup } from "../__mocks__/mockData";

describe("transformToTypes", () => {
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

    test("filters to participant type id", () => {
        const input: Section[] = [
            {...baseSection, id: 'c345', participant_type_id: 'scouts', section_name: '1st Ashwell Scouts', group: {...baseGroup, group_name: '1st Ashwell'}},
            {...baseSection, id: 'b234', participant_type_id: 'cubs', section_name: '1st Ashwell Cubs', group: {...baseGroup, group_name: '1st Ashwell'}},
            {...baseSection, id: 'a123', participant_type_id: 'beavers', section_name: '1st Ashwell Beavers', group: {...baseGroup, group_name: '1st Ashwell'}},
            {...baseSection, id: 'd456', participant_type_id: 'cubs', section_name: '1st Baldock Cubs', group: {...baseGroup, group_name: '1st Baldock'}},
        ];

        const expectedOutput = [
            {
                group: "1st Ashwell",
                options: [
                    {id: 'b234', section_name: "1st Ashwell Cubs"},
                ],
            },
            {
                group: "1st Baldock",
                options: [
                    {id: 'd456', section_name: "1st Baldock Cubs"},
                ],
            }
        ];

        expect(transformToSections(input, 'cubs')).toEqual(expectedOutput);
    });

    test("filters to empty participant type id", () => {
        const input: Section[] = [
            {...baseSection, id: 'c345', participant_type_id: 'scouts', section_name: '1st Ashwell Scouts', group: {...baseGroup, group_name: '1st Ashwell'}},
            {...baseSection, id: 'b234', participant_type_id: 'cubs', section_name: '1st Ashwell Cubs', group: {...baseGroup, group_name: '1st Ashwell'}},
            {...baseSection, id: 'a123', participant_type_id: 'beavers', section_name: '1st Ashwell Beavers', group: {...baseGroup, group_name: '1st Ashwell'}},
            {...baseSection, id: 'd456', participant_type_id: 'cubs', section_name: '1st Baldock Cubs', group: {...baseGroup, group_name: '1st Baldock'}},
        ];

        const expectedOutput = [
            {
                group: "1st Ashwell",
                options: [
                    {id: 'a123', section_name: "1st Ashwell Beavers"},
                    {id: 'b234', section_name: "1st Ashwell Cubs"},
                    {id: 'c345', section_name: "1st Ashwell Scouts"},
                ],
            },
            {
                group: "1st Baldock",
                options: [
                    {id: 'd456', section_name: "1st Baldock Cubs"},
                ],
            }
        ];

        expect(transformToSections(input, null)).toEqual(expectedOutput);
    });
});