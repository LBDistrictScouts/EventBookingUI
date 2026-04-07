import {
    assertReadableResponse,
    getOrMakeCookie,
    getOriginDevLocalhost,
    isJsonObject,
    looseInstanceOf,
    setValidCookie,
    validateString,
} from "../src/data/utilities";
import { getCookie, setCookie } from "typescript-cookie";

describe("utilities", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("validateString accepts non-empty strings and rejects empty values", () => {
        expect(validateString("abc")).toBe(true);
        expect(validateString("")).toBe(false);
        expect(validateString(undefined)).toBe(false);
    });

    test("getOrMakeCookie returns existing cookie values without generating", () => {
        (getCookie as jest.Mock).mockReturnValue("existing");
        const generator = jest.fn(() => "new-value");

        const result = getOrMakeCookie("csrf", generator);

        expect(result).toBe("existing");
        expect(generator).not.toHaveBeenCalled();
        expect(setCookie).not.toHaveBeenCalled();
    });

    test("getOrMakeCookie generates and stores a new cookie when missing", () => {
        (getCookie as jest.Mock).mockReturnValue(undefined);
        const generator = jest.fn(() => "generated");

        const result = getOrMakeCookie("csrf", generator);

        expect(result).toBe("generated");
        expect(generator).toHaveBeenCalledTimes(1);
        expect(setCookie).toHaveBeenCalled();
    });

    test("getOrMakeCookie throws for invalid cookie keys", () => {
        expect(() => getOrMakeCookie("", () => "x")).toThrow(/cookie key/i);
    });

    test("setValidCookie stringifies object values and merges attributes", () => {
        setValidCookie("entry", { id: 1 }, { path: "/custom" });

        expect(setCookie).toHaveBeenCalledWith(
            "entry",
            JSON.stringify({ id: 1 }),
            expect.objectContaining({ path: "/custom" })
        );
    });

    test("getOriginDevLocalhost rewrites localhost http origins to https", () => {
        window.history.pushState({}, "", "/register/event-1");

        expect(getOriginDevLocalhost()).toBe("https://localhost/register/event-1");
    });

    test("isJsonObject rejects null and arrays", () => {
        expect(isJsonObject({ hello: "world" })).toBe(true);
        expect(isJsonObject(null)).toBe(false);
        expect(isJsonObject(["a"])).toBe(false);
    });

    test("assertReadableResponse throws once the response body has been consumed", async () => {
        const response = { bodyUsed: true } as Response;

        expect(() => assertReadableResponse(response)).toThrow(/body has been used/i);
    });

    test("looseInstanceOf supports native instances, tagged objects, and null", () => {
        class Example {}
        class TaggedExample {}
        Object.defineProperty(TaggedExample.prototype, Symbol.toStringTag, { value: "TaggedExample" });
        const taggedObject = Object.create({ [Symbol.toStringTag]: "TaggedExample" });

        expect(looseInstanceOf(new Example(), Example)).toBe(true);
        expect(looseInstanceOf(taggedObject, TaggedExample)).toBe(true);
        expect(looseInstanceOf(null, Example)).toBe(false);
    });
});
