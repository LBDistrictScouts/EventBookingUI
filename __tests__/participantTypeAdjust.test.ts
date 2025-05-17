import * as transform from '../src/data/transform';
import { participantTypeAdjust } from '../src/data/transform';
import { baseParticipantType, baseSection } from "../__mocks__/mockData";
import { ParticipantType, Section } from "../src/data/dataTypes";


describe('participantTypeAdjust', () => {
    let setEnableSection: jest.Mock;
    let setSectionList: jest.Mock;
    let setSectionRequired: jest.Mock;

    const abc = { ...baseParticipantType, id: 'abc', uniformed: false, out_of_district: false, adult: false };
    const efg = { ...baseParticipantType, id: 'efg', uniformed: true, out_of_district: false, adult: true };
    const xyz = { ...baseParticipantType, id: 'xyz', uniformed: true, out_of_district: true, adult: false };

    const participantTypes: ParticipantType[] = [abc, efg, xyz];
    const sections: Section[] = [{ ...baseSection, id: '101', section_name: 'Math' }];

    beforeEach(() => {
        setEnableSection = jest.fn();
        setSectionList = jest.fn();
        setSectionRequired = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should do nothing if selectedParticipantTypeId is null or empty', () => {
        participantTypeAdjust([], [], '', setEnableSection, setSectionList, setSectionRequired);
        participantTypeAdjust([], [], null as unknown as string, setEnableSection, setSectionList, setSectionRequired);

        expect(setEnableSection).not.toHaveBeenCalled();
        expect(setSectionRequired).toHaveBeenCalledWith(false);
        expect(setSectionList).not.toHaveBeenCalled();
    });

    it('should throw an error if participant type is not found', () => {
        jest.spyOn(transform, 'retrieveParticipantType').mockImplementation(() => {
            throw new Error('ParticipantType not found');
        });

        expect(() => {
            participantTypeAdjust([], [], '1', setEnableSection, setSectionList, setSectionRequired);
        }).toThrow('ParticipantType with ID "1" not found.');
    });

    it('should disable sections if participant is neither uniformed nor out_of_district', () => {
        const deps = {
            retrieveParticipantType: jest.fn().mockReturnValue(abc),
            transformToSections: jest.fn().mockReturnValue([{ group: 'Test Group', options: [] }])
        };

        participantTypeAdjust(participantTypes, sections, 'abc', setEnableSection, setSectionList, setSectionRequired, deps);

        expect(deps.retrieveParticipantType).toHaveBeenCalledWith('abc', participantTypes);
        expect(setEnableSection).toHaveBeenCalledWith(false);
        expect(setSectionRequired).toHaveBeenCalledWith(false);
        expect(setSectionList).toHaveBeenCalledWith([]);
    });


    it('should enable sections and NOT filter by participantTypeId if participant is an adult', () => {
        const deps = {
            retrieveParticipantType: jest.fn().mockReturnValue(efg),
            transformToSections: jest.fn().mockReturnValue([{ group: 'Group A', options: [] }])
        };

        participantTypeAdjust(participantTypes, sections, 'efg', setEnableSection, setSectionList, setSectionRequired, deps);

        expect(deps.retrieveParticipantType).toHaveBeenCalledWith('efg', participantTypes);
        expect(deps.transformToSections).toHaveBeenCalledWith(sections);
        expect(setEnableSection).toHaveBeenCalledWith(true);
        expect(setSectionRequired).toHaveBeenCalledWith(false);
        expect(setSectionList).toHaveBeenCalledWith([{ group: 'Group A', options: [] }]);
    });

    it('should enable sections and filter by participantTypeId if non-adult and uniformed/out_of_district', () => {
        const deps = {
            retrieveParticipantType: jest.fn().mockReturnValue(xyz),
            transformToSections: jest.fn().mockReturnValue([{ group: 'Group B', options: [] }])
        };

        participantTypeAdjust(participantTypes, sections, 'xyz', setEnableSection, setSectionList, setSectionRequired, deps);

        expect(deps.retrieveParticipantType).toHaveBeenCalledWith('xyz', participantTypes);
        expect(deps.transformToSections).toHaveBeenCalledWith(sections, 'xyz');
        expect(setEnableSection).toHaveBeenCalledWith(true);
        expect(setSectionRequired).toHaveBeenCalledWith(true);
        expect(setSectionList).toHaveBeenCalledWith([{ group: 'Group B', options: [] }]);
    });
});