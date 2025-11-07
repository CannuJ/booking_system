import { getDayOfWeek } from "./dateNames";

describe("getDayOfWeek tests", () => {
	test("Days return in sorted order", () => {
		expect(getDayOfWeek(0)).toBe("Sunday");
		expect(getDayOfWeek(1)).toBe("Monday");
		expect(getDayOfWeek(2)).toBe("Tuesday");
		expect(getDayOfWeek(3)).toBe("Wednesday");
		expect(getDayOfWeek(4)).toBe("Thursday");
		expect(getDayOfWeek(5)).toBe("Friday");
		expect(getDayOfWeek(6)).toBe("Saturday");
	});
});
