import {getCookie, setCookie} from "typescript-cookie";


export function validateString(input: unknown): input is string {
    return typeof input === 'string' && input.length !== 0
}


function getDefaultCookieOpts(): Record<string, unknown> {
    if (window.location.href.includes('localhost')) {
        return {sameSite: 'None', secure: false, domain: 'localhost', path: '/'};
    }

    return {sameSite: 'None', secure: true, path: '/'}
}

const defaultCookieOpts: Record<string, unknown> = getDefaultCookieOpts();


export function getOrMakeCookie(cookie_key: string, cookie_generator: () => string): string {
    if (!validateString(cookie_key)) {
        throw new Error('Cookie Key is not a valid string.')
    }

    let return_value: string | undefined
    const cookie_value = getCookie(cookie_key)

    if (!validateString(cookie_value)) {
        return_value = cookie_generator()
        setCookie(cookie_key, return_value, defaultCookieOpts);
    } else {
        return_value = cookie_value
    }

    return return_value
}

function ensureString(input: number|string|undefined|object): string {
    return typeof input === "string" ? input : JSON.stringify(input);
}

export function setValidCookie(
    cookie_key: string,
    cookie_value: number|string|undefined|object,
    attributes: Record<string, unknown> = {},
): string {
    const mergedAttributes = { ...defaultCookieOpts, ...attributes }

    return setCookie(cookie_key, ensureString(cookie_value), mergedAttributes);
}


export function getOriginDevLocalhost(): string {
    let currentHref = window.location.href
    if (currentHref.includes('localhost')) {
        currentHref = currentHref.replace('http://', 'https://')
    }

    return currentHref
}

/**
 * JSON Object
 */
export type JsonObject = { [Key in string]?: JsonValue }
/**
 * JSON Array
 */
export type JsonArray = JsonValue[]
/**
 * JSON Primitives
 */
export type JsonPrimitive = string | number | boolean | null
/**
 * JSON Values
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray

export function isJsonObject<T = JsonObject>(input: unknown): input is T {
    return !(input === null || typeof input !== 'object' || Array.isArray(input));
}

export function assertReadableResponse(response: Response) {
    if (response.bodyUsed) {
        throw new TypeError('"response" body has been used already')
    }
}


type Constructor<T extends object = object> = new (...args: unknown[]) => T

export function looseInstanceOf<T extends object>(input: unknown, expected: Constructor<T>): input is T {
    if (input == null) {
        return false
    }

    try {
        const prototype = Object.getPrototypeOf(input) as { [Symbol.toStringTag]?: string } | null;
        const expectedPrototype = expected.prototype as { [Symbol.toStringTag]?: string };

        return (
            input instanceof expected ||
            prototype?.[Symbol.toStringTag] === expectedPrototype[Symbol.toStringTag]
        )
    } catch {
        return false
    }
}
