// Typed Properties
export type Email = string;

// Equivalent Enums
export enum DanceType {
	SALSA = "SALSA",
	BACHATA = "BACHATA",
	REGGAETON = "REGGAETON",
}
export enum DanceLevel {
	L1 = "L1",
	L2 = "L2",
	L3 = "L3",
	NONE = "NONE",
}

// Template
export interface Template {
	id: number;
	type: DanceType;
	level: DanceLevel;
	defaultLength: number;
	defaultMaxSpots: number;
}

// Session
export interface Session {
	id: number;
	date: string;
	startTime: string;
	maxSpots: number; // default 20
	template: Pick<Template, "type" | "level">;
}
export interface SessionWithCount extends Session {
	_count: { bookings: number };
}

export interface SessionWithRemainingSpots {
	id: number;
	date: string;
	startTime: string;
	maxSpots: number; // default 20
	spotsRemaining: number;
	type: DanceType;
	level: DanceLevel;
}

// Booking
export type Booking = {
	id: number;
	sessionId: number;
	email: Email;
};
