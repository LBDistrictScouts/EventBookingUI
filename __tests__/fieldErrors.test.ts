import * as datatypes from "../src/data/dataTypes";

import { handleFieldError } from '../src/data/backend';
import { ServerValidationErrorList } from '../src/data/dataTypes';


describe('handleFieldError', () => {
    let retrieveSpy: jest.SpyInstance | undefined;
    let transformSpy: jest.SpyInstance | undefined;

    afterEach(() => {
        jest.clearAllMocks();
        // Restore spies if they were created
        retrieveSpy?.mockRestore();
        transformSpy?.mockRestore();
    });

    it('should return undefined if field is not in serverErrors', () => {
        jest.spyOn(datatypes, 'doesNotHaveKeyInErrors').mockReturnValue(true);

        const result = handleFieldError('entry_email', {});
        expect(result).toBeUndefined();
    });

    it('should return single error string if one error exists', () => {
        jest.spyOn(datatypes, 'doesNotHaveKeyInErrors').mockReturnValue(false);

        const errors: ServerValidationErrorList = {
            entry_email: {
                email: "The provided value must be an e-mail address"
            }
        };

        const result = handleFieldError('entry_email', errors);
        expect(result).toBe("The provided value must be an e-mail address.");
    });

    it('should return joined error string if multiple errors exist', () => {
        jest.spyOn(datatypes, 'doesNotHaveKeyInErrors').mockReturnValue(false);

        const errors: ServerValidationErrorList = {
            password: {
                required: "Password is required",
                minLength: "Password must be at least 8 characters",
            },
        };

        const result = handleFieldError('password', errors);
        expect(result).toBe("Password is required. Password must be at least 8 characters.");
    });

    it('should return undefined if no error strings found (empty object)', () => {
        jest.spyOn(datatypes, 'doesNotHaveKeyInErrors').mockReturnValue(false);

        const errors: ServerValidationErrorList = {
            username: {},
        };

        const result = handleFieldError('username', errors);
        expect(result).toBeUndefined();
    });
});
