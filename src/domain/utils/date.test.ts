import { yyyyMmDd, isYyyyMmDd } from "./date";

describe("yyyyMmDd tests", () => {
	test("converts date as expected", () => {
		expect(yyyyMmDd(new Date("2025-11-07"))).toBe("2025-11-07");
		expect(yyyyMmDd(new Date("2025-6-8"))).toBe("2025-06-08");
	});
});

describe("isYyyyMmDd tests", () => {
	test("valid emails", () => {
		expect(isYyyyMmDd("2025-11-07")).toBe(true);
	});
	test("invalid padding", () => {
		expect(isYyyyMmDd("2025-11-7")).toBe(false);
	});
});
