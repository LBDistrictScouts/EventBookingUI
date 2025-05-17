import {
    ParticipantTypesDataResponse,
    Section,
    SectionsDataResponse, EntrySubmissionResponse,
    ServerValidationErrorList, doesNotHaveKeyInErrors,
    SavedEntry, Lookup,
    BookableEventResponse, BookableEvent, ParticipantType, Entry, EntryResponse, ValidCheckInRequest
} from "./dataTypes";
import {looseInstanceOf, assertReadableResponse, JsonValue, isJsonObject, setValidCookie} from "./utilities";
import {getCookie} from "typescript-cookie";

let host = 'https://' + window.location.host;

if (host.includes('localhost')) {
    host = host.replace('5173', '8765');
    host = host.replace('https://', 'http://');
}

export function getOriginDevLocalhost(): string {
    let currentHref = window.location.href
    if (currentHref.includes('localhost')) {
        currentHref = currentHref.replace('http://', 'https://')
    }

    return currentHref
}


export async function fetchRequest(path: string, method: string = 'GET', data: undefined|object = undefined): Promise<Response> {
    const headers = new Headers();
    headers.set("Content-Type", "application/json; charset=UTF-8");
    headers.set('accept', 'application/json');
    headers.set('Origin', getOriginDevLocalhost())

    const csrf: string|undefined = getCookie('csrfToken');
    if (csrf) {
        headers.set('X-CSRF-Token', csrf);
    }

    const url = new URL(host + path);
    const mode = 'cors';

    if (!data) {
        return fetch(url, {headers, method, mode});
    }

    return fetch(url, {
        headers,
        method,
        mode,
        'body': JSON.stringify(data)
    });
}


async function processParticipantTypes(response: Response): Promise<ParticipantType[]> {
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response')
    }

    if (!response.ok) {
        throw new Error('"response" was not successful.')
    }

    let json: JsonValue

    assertReadableResponse(response)
    try {
        json = await response.json()
    } catch {
        throw new Error('failed to parse "response" body as JSON')
    }

    if (!isJsonObject<ParticipantTypesDataResponse>(json)) {
        throw new Error('"response" body must be a top level object')
    }

    return json.participantTypes
}


export async function getParticipantTypes(): Promise<ParticipantType[]> {
    const path = '/participant-types.json'

    const response = await fetchRequest(path)

    return processParticipantTypes(response)
}

async function processBookableEvent(response: Response): Promise<BookableEvent> {
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response')
    }

    if (!response.ok) {
        throw new Error('"response" was not successful.')
    }

    let json: JsonValue

    assertReadableResponse(response)
    try {
        json = await response.json()
    } catch {
        throw new Error('failed to parse "response" body as JSON')
    }

    if (!isJsonObject<BookableEventResponse>(json)) {
        throw new Error('"response" body must be a top level object')
    }

    return json.event
}


export async function getBookableEvent(): Promise<BookableEvent> {
    const path = '/events/current.json'

    const response = await fetchRequest(path)

    return processBookableEvent(response)
}

async function processSections(response: Response): Promise<Section[]> {
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response')
    }

    if (response.status !== 200) {
        throw new Error('"response" was not successful.')
    }

    let json: JsonValue

    assertReadableResponse(response)
    try {
        json = await response.json()
    } catch {
        throw new Error('failed to parse "response" body as JSON')
    }

    if (!isJsonObject<SectionsDataResponse>(json)) {
        throw new Error('"response" body must be a top level object')
    }


    return json.sections
}


export async function getSections(): Promise<Section[]> {
    const path = '/sections.json'

    const response = await fetchRequest(path)

    return processSections(response)
}


export async function SubmitEntryData(data: object, setServerErrors: CallableFunction, setSavedEntry: (entry: SavedEntry) => void): Promise<EntrySubmissionResponse> {
    const response = await fetchRequest( '/book.json', 'POST', data)

    const result = await response.json();
    if (!isJsonObject<EntrySubmissionResponse>(result)) {
        throw new Error('"response" body must be a top level object')
    }

    if (response.ok && result.success) {
        console.log("Success:", result.message);
        // Handle success (e.g., show a success message or redirect)

        if (!isJsonObject<SavedEntry>(result.entry)) {
            throw new Error('Entry is invalid.')
        }

        setSavedEntry(result.entry)
    } else {
        console.error("Error:", result.message);
        // Handle error (e.g., show an error message)
        setServerErrors(result.errors || {});
    }

    return result;
}


export function handleFieldError(fieldName: string, serverErrors: ServerValidationErrorList): string | undefined {
    if (doesNotHaveKeyInErrors(fieldName, serverErrors)) {
        return undefined;
    }

    const errors = serverErrors[fieldName];

    const collectedErrors = collectAllErrorStrings(errors);

    return collectedErrors.length > 0 ? collectedErrors.join('. ') + '.' : undefined;
}

// Recursive helper to collect all error strings from a nested object
function collectAllErrorStrings(
    errors: { [key: string]: string | ServerValidationErrorList }
): string[] {
    let result: string[] = [];

    for (const key in errors) {
        const value = errors[key];
        if (typeof value === "string") {
            result.push(value);
        } else if (typeof value === "object" && value !== null) {
            // Safe to pass value as ServerValidationErrorList since typeof "string" is handled above
            result = result.concat(collectAllErrorStrings(value as { [key: string]: string | ServerValidationErrorList }));
        }
    }

    return result;
}

export function getParticipantServerErrors(participantIndex: number, serverErrors: ServerValidationErrorList): ServerValidationErrorList {
    const participantsErrors = serverErrors['participants'] ?? {};
    const participantErrors = participantsErrors[participantIndex.toString()] ?? {};

    if (typeof participantErrors == "object") {
        return participantErrors;
    }

    return {}
}

export async function lookupEntry(lookup: Lookup): Promise<Entry> {
    const url = host + '/lookup.json';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(lookup),
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();

        if (!isJsonObject<EntryResponse>(data)) {
            if (process.env.NODE_ENV === 'development') {
                console.debug('Lookup response data:', data);
            }

            throw new Error(data?.message || 'Invalid response from server.');
        }

        return data.entry;
    } catch (error) {
        console.error('Lookup failed:', error);
        throw error;
    }
}


export function handleReferenceNumber(referenceNumber: string): string {
    referenceNumber = referenceNumber.replace(/^([A-Z]+[0-9]*-?)/gi, '');

    if (/^[0-9]{1,3}$/.test(referenceNumber)) {
        console.debug('Lookup passed:', referenceNumber);
        return referenceNumber;
    }

    return referenceNumber;
}

export function storeEntry(entry: Entry): void {
    setValidCookie('entry', JSON.stringify(entry));
}

export function getSavedEntry(): Entry|undefined {
    const entryCookie = getCookie('entry')

    if (!entryCookie) {
        return undefined;
    }

    const entryValue = JSON.parse(entryCookie);

    if (isJsonObject<Entry>(entryValue)) {
        return entryValue;
    }

    return undefined;
}

export function storeEvent(event: BookableEvent): void {
    setValidCookie('event', JSON.stringify(event));
}

export function getSavedEvent(): BookableEvent|undefined {
    const eventCookie = getCookie('event')

    if (!eventCookie) {
        return undefined;
    }

    const eventValue = JSON.parse(eventCookie);

    if (isJsonObject<BookableEvent>(eventValue)) {
        return eventValue;
    }

    return undefined;
}



export async function submitCheckIn(check_in_data: ValidCheckInRequest) {
    const url = host + '/check-in.json';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(check_in_data),
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Lookup failed:', error);
        throw error;
    }
}