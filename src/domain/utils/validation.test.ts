import { isValidDanceType, isValidEmail } from "./validation";

describe("isValidDanceType tests", () => {
	test("valid dance types", () => {
		expect(isValidDanceType("bachata")).toBe(true);
		expect(isValidDanceType("salsa")).toBe(true);
		expect(isValidDanceType("reggaeton")).toBe(true);
		expect(isValidDanceType("any")).toBe(true);
	});
	test("invalid or empty dance types", () => {
		expect(isValidDanceType("notvalid")).toBe(false);
		expect(isValidDanceType("")).toBe(false);
		expect(isValidDanceType(undefined)).toBe(false);
	});
	// based on original spec we expect this to fail
	test("case sensitive", () => {
		expect(isValidDanceType("Salsa")).toBe(false);
		expect(isValidDanceType("REGGAETON")).toBe(false);
		expect(isValidDanceType("BaCHaTa")).toBe(false);
	});
});

describe("isValidEmail tests", () => {
	// match function returns RegExpArr format if valid, otherwise null for invalid
	test("valid emails", () => {
		expect(isValidEmail("person@provider.com")).toBeTruthy();
		expect(isValidEmail("name.surname@company.co.au")).toBeTruthy();
	});
	test("invalid emails", () => {
		expect(isValidEmail("notAnEmail")).toBeFalsy();
		expect(isValidEmail("wrong.because.no.at.symbol")).toBeFalsy();
		expect(isValidEmail("you@tried@but@still@not@quite")).toBeFalsy();
		expect(isValidEmail("")).toBeFalsy();
	});
});
