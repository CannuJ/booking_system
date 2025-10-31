import { DanceType } from "@prisma/client";

const VALID_TYPES = ["salsa", "bachata", "reggaeton", "any"] as const;
export type ValidDanceType = (typeof VALID_TYPES)[number];

export function isValidDanceType(x: unknown): x is ValidDanceType {
	return (
		typeof x === "string" && (VALID_TYPES as readonly string[]).includes(x)
	);
}

export const DANCE_TO_ENUM: Record<
	Exclude<ValidDanceType, "any">,
	DanceType
> = {
	salsa: DanceType.SALSA,
	bachata: DanceType.BACHATA,
	reggaeton: DanceType.REGGAETON,
};

// used to normalise dates such as 2025-4-8 -> 2025-04-08 (4th April) for consistency
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
export const yyyyMmDd = (d: Date) =>
	`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const isYyyyMmDd = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);

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

export const isValidEmail = (email: string) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
};
