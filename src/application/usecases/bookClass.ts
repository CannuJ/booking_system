import type { TransactionPort } from "../ports";
import {
	ClassFullError,
	DuplicateBookingError,
	SessionNotFoundError,
} from "../../domain/errors";
import type { Booking } from "../../domain/entities";

export class BookClass {
	constructor(private readonly tx: TransactionPort) {}

	async exec(sessionId: number, email: string): Promise<Booking> {
		return this.tx.withTransaction(async ({ bookings, sessions }) => {
			console.log("hi2");
			const maxSpots = await sessions.getMaxSpots(sessionId);
			if (maxSpots == null) throw new SessionNotFoundError("Session not found");
			console.log("hi3");
			const dup = await bookings.findBySessionAndEmail(sessionId, email);
			if (dup) throw new DuplicateBookingError("Already booked");
			console.log("hi4");
			const current = await bookings.countBySession(sessionId);
			if (current >= maxSpots) throw new ClassFullError("Class is full");
			console.log("hi5");
			return bookings.create(sessionId, email);
		});
	}
}
