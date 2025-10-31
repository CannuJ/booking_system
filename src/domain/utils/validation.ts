import { type ValidDanceType } from "../constants/dance";
import { VALID_TYPES } from "../constants/dance";

export function isValidDanceType(x: unknown): x is ValidDanceType {
	return (
		typeof x === "string" && (VALID_TYPES as readonly string[]).includes(x)
	);
}

export const isValidEmail = (email: string) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
};
