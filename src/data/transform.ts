import {ParticipantType, CategorisedParticipantType, Section, GroupedSection} from './dataTypes'
import * as React from "react";



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

export function transformToSections(sections: Section[], selectedParticipantTypeId: string|null = null): GroupedSection[] {
    const groupedData: GroupedSection[] = sections.reduce<GroupedSection[]>((acc, item) => {
        const { group, id, section_name, participant_type_id } = item;

        if (selectedParticipantTypeId !== null && selectedParticipantTypeId !== participant_type_id) {
            return acc;
        }

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


export function retrieveParticipantType(participantTypeId: string, participantTypes: ParticipantType[]): ParticipantType {
    const participantType = participantTypes.find(pt => pt.id === participantTypeId);

    if (!participantType) {
        throw new Error(`ParticipantType with ID "${participantTypeId}" not found.`);
    }

    return participantType;
}


export function participantTypeAdjust(
    participantTypes: ParticipantType[],
    sections: Section[],
    selectedParticipantTypeId: string,
    setEnableSection: React.Dispatch<React.SetStateAction<boolean>>,
    setSectionList: React.Dispatch<React.SetStateAction<GroupedSection[]>>
): void {
    if (selectedParticipantTypeId === null || selectedParticipantTypeId === '') {
        return;
    }

    const participantType = retrieveParticipantType(selectedParticipantTypeId, participantTypes)

    if (!participantType.uniformed && !participantType.out_of_district) {
        setEnableSection(false);
        setSectionList([]);
        return;
    }

    if (participantType.adult) {
        setEnableSection(true);
        setSectionList(transformToSections(sections));
        return;
    }

    setEnableSection(true);
    setSectionList(transformToSections(sections, selectedParticipantTypeId));
}
