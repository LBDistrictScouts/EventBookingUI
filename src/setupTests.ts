import "@testing-library/jest-dom";
import { cleanup } from '@testing-library/react';
import { TextDecoder, TextEncoder } from "util";

afterEach(cleanup);

if (typeof global.TextEncoder === "undefined") {
    global.TextEncoder = TextEncoder as typeof global.TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
    global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}
