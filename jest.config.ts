import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"], // Ensure JS & JSX are included
    transform: {
        "^.+\\.[tj]sx?$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
    },
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
    moduleNameMapper: {
        "\\.(css|scss)$": "identity-obj-proxy",
        "^typescript-cookie$": "<rootDir>/__mocks__/typescript-cookie.ts",
    },
};

export default config;