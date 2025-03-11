import { participantTypeAdjust, transformToSections, retrieveParticipantType } from '../src/data/transform';
import {baseParticipantType, baseSection} from "../__mocks__/mockData";
import {ParticipantType} from "../src/data/dataTypes";


jest.mock('../src/data/transform', () => ({
    ...jest.requireActual('../src/data/transform'),
    retrieveParticipantType: jest.fn(),
    transformToSections: jest.fn(),
}));

describe('participantTypeAdjust', () => {
    let setEnableSection: jest.Mock;
    let setSectionList: jest.Mock;

    const participantTypes: ParticipantType[] = [
        {...baseParticipantType, id: 'abc', uniformed: false, out_of_district: false, adult: false},
        {...baseParticipantType, id: 'efg', uniformed: true, out_of_district: false, adult: true},
        {...baseParticipantType, id: 'xyz', uniformed: true, out_of_district: true, adult: false},
    ]

    beforeEach(() => {
        setEnableSection = jest.fn();
        setSectionList = jest.fn();
        jest.clearAllMocks(); // Clears previous mock calls
    });

    it('should do nothing if selectedParticipantTypeId is null or empty', () => {
        participantTypeAdjust([], [], '', setEnableSection, setSectionList);
        participantTypeAdjust([], [], null as unknown as string, setEnableSection, setSectionList);

        expect(setEnableSection).not.toHaveBeenCalled();
        expect(setSectionList).not.toHaveBeenCalled();
    });

    it('should throw an error if participant type is not found', () => {
        (retrieveParticipantType as jest.Mock).mockImplementation(() => {
            throw new Error('ParticipantType not found');
        });

        expect(() => {
            participantTypeAdjust([], [], '1', setEnableSection, setSectionList);
        }).toThrow('ParticipantType with ID "1" not found.');
    });

    it('should disable sections if participant is neither uniformed nor out_of_district', () => {
        (retrieveParticipantType as jest.Mock).mockReturnValue({
            id: 'abc',
            uniformed: false,
            out_of_district: false,
            adult: false,
        });

        participantTypeAdjust(participantTypes, [], 'abc', setEnableSection, setSectionList);

        expect(setEnableSection).toHaveBeenCalledWith(false);
        expect(setSectionList).toHaveBeenCalledWith([]);
    });

    it('should enable sections and transform without participantType if participant is an adult', () => {
        const mockType = {
            ...baseParticipantType,
            id: 'efg',
            uniformed: true,
            out_of_district: false,
            adult: true,
        }
        const sectionsMock = [{...baseSection, id: '101', section_name: 'Math', participant_type:  mockType}];

        (retrieveParticipantType as jest.Mock).mockReturnValue(mockType);
        (transformToSections as jest.Mock).mockReturnValue([{ group: 'A', options: [] }]);

        participantTypeAdjust(participantTypes, sectionsMock, 'efg', setEnableSection, setSectionList);

        expect(setEnableSection).toHaveBeenCalledWith(true);
        expect(transformToSections).toHaveBeenCalledWith(sectionsMock);
        expect(setSectionList).toHaveBeenCalledWith([{ group: 'A', options: [] }]);
    });

    it('should enable sections and transform with participantType if not an adult but meets criteria', () => {
        const sectionsMock = [{ ...baseSection, id: '101', section_name: 'Math' }];

        (retrieveParticipantType as jest.Mock).mockReturnValue({
            id: 'xyz',
            uniformed: true,
            out_of_district: true,
            adult: false,
        });

        (transformToSections as jest.Mock).mockReturnValue([{ group: 'B', options: [] }]);

        participantTypeAdjust(participantTypes, sectionsMock, 'abc', setEnableSection, setSectionList);

        expect(setEnableSection).toHaveBeenCalledWith(true);
        expect(transformToSections).toHaveBeenCalledWith(sectionsMock, '1');
        expect(setSectionList).toHaveBeenCalledWith([{ group: 'B', options: [] }]);
    });
});