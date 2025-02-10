import {
    ParticipantTypesDataResponse,
    CategorisedParticipantType,
    GroupedSection,
    SectionsDataResponse, EntrySubmissionResponse,
    ServerValidationErrorList, doesNotHaveKeyInErrors
} from "./dataTypes.ts";
import {looseInstanceOf, assertReadableResponse, JsonValue, isJsonObject} from "./utilities.ts";
import {transformToSections, transformToTypes} from "./transform.ts";

const host = 'http://localhost:8765';

function getOriginDevLocalhost(): string {
    let currentHref = window.location.href
    if (currentHref.includes('localhost')) {
        currentHref = currentHref.replace('http://', 'https://')
    }

    return currentHref
}




async function fetchRequest(path: string, method: string = 'GET', data: undefined|object = undefined): Promise<Response> {
    const headers = new Headers();
    headers.set("Content-Type", "application/json; charset=UTF-8");
    headers.set('accept', 'application/json');
    headers.set('Origin', getOriginDevLocalhost())

    const url = new URL(host + path);
    const mode = 'cors';

    if (!data) {
        const request = new Request(url, {headers, method, mode})
        return fetch(request);
    }

    const request = new Request(url, {
        headers,
        method,
        mode,
        'body': JSON.stringify(data)
    })
    return fetch(request);
}


async function processParticipantTypes(response: Response): Promise<CategorisedParticipantType[]> {
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

    if (!isJsonObject<ParticipantTypesDataResponse>(json)) {
        throw new Error('"response" body must be a top level object')
    }


    return transformToTypes(json.participantTypes)
}


export async function getParticipantTypes(): Promise<CategorisedParticipantType[]> {
    const path = '/participant-types.json'

    const response = await fetchRequest(path)

    return processParticipantTypes(response)
}

async function processSections(response: Response): Promise<GroupedSection[]> {
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


    return transformToSections(json.sections)
}


export async function getSections(): Promise<GroupedSection[]> {
    const path = '/sections.json'

    const response = await fetchRequest(path)

    return processSections(response)
}


export async function SubmitEntryData(data: object, setServerErrors: CallableFunction): Promise<EntrySubmissionResponse> {
    const response = await fetchRequest('/book.json', 'POST', data)

    const result = await response.json();
    if (!isJsonObject<EntrySubmissionResponse>(result)) {
        throw new Error('"response" body must be a top level object')
    }

    if (response.ok && result.success) {
        console.log("Success:", result.message);
        // Handle success (e.g., show a success message or redirect)
    } else {
        console.error("Error:", result.message);
        // Handle error (e.g., show an error message)
        setServerErrors(result.errors || {});
    }

    return result;
}


export function handleFieldError(fieldName: string, serverErrors: ServerValidationErrorList): string | undefined
{
    if (doesNotHaveKeyInErrors(fieldName, serverErrors)) {
        return undefined;
    }

    const errors = serverErrors[fieldName];

    if (typeof errors == "object") {
        const errValue = errors ? errors[0] : undefined;

        if (typeof errValue === "string") {
            return errValue;
        }

        return ;
    }

    return errors;
}

export function getParticipantServerErrors(participantIndex: number, serverErrors: ServerValidationErrorList): ServerValidationErrorList {
    const participantsErrors = serverErrors['participants'] ?? {};
    const participantErrors = participantsErrors[participantIndex.toString()] ?? {};

    if (typeof participantErrors == "object") {
        return participantErrors;
    }

    return {}
}