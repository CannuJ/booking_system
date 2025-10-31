const DAY_NAMES = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
] as const;

export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const getDayOfWeek = (d: DayIndex): string => DAY_NAMES[d];
