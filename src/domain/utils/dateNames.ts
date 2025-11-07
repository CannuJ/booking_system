const DAY_NAMES = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
] as const;

// restricts input to 0-6
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const getDayOfWeek = (d: DayIndex): (typeof DAY_NAMES)[number] =>
	DAY_NAMES[d];
