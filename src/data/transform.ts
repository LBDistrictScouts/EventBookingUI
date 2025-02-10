import {ParticipantType, CategorisedParticipantType, Section, GroupedSection} from './dataTypes.ts'



export function transformToTypes(participantTypes: ParticipantType[]): CategorisedParticipantType[] {
    return participantTypes.reduce<CategorisedParticipantType[]>((acc, item) => {
        const { category, id, participant_type } = item;

        // Check if the group already exists
        const existingGroup = acc.find((g) => g.category === category);

        if (existingGroup) {
            // Add the option to the existing group
            existingGroup.options.push({ id, participant_type });
        } else {
            // Create a new group
            acc.push({
                category,
                options: [{ id, participant_type }],
            });
        }

        return acc;
    }, []);
}

export function transformToSections(sections: Section[]): GroupedSection[] {
    const groupedData: GroupedSection[] = sections.reduce<GroupedSection[]>((acc, item) => {
        const { group, id, section_name } = item;

        // Check if the group already exists
        const existingGroup = acc.find((g) => g.group === group.group_name);

        if (existingGroup) {
            // Add the option to the existing group
            existingGroup.options.push({ id, section_name });
        } else {
            // Create a new group
            acc.push({
                group: group.group_name,
                options: [{ id, section_name }],
            });
        }

        return acc;
    }, []);

    // Sort the groups alphabetically by group name
    groupedData.sort((a, b) => a.group.localeCompare(b.group));

    // Sort the options within each group alphabetically by label
    groupedData.forEach((group) => {
        group.options.sort((a, b) => a.section_name.localeCompare(b.section_name));
    });

    return groupedData;
}
