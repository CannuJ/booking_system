import { DanceType } from "../entities";

export const VALID_TYPES = ["salsa", "bachata", "reggaeton", "any"] as const;
export type ValidDanceType = (typeof VALID_TYPES)[number];

export const DANCE_TO_ENUM: Record<
	Exclude<ValidDanceType, "any">,
	DanceType
> = {
	salsa: DanceType.SALSA,
	bachata: DanceType.BACHATA,
	reggaeton: DanceType.REGGAETON,
};
