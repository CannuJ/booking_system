import type { TransactionPort } from "../ports";
import {
	ClassFullError,
	DuplicateBookingError,
	SessionNotFoundError,
} from "../../domain/errors";
import type { Booking } from "../../domain/entities";

export class BookSession {
	constructor(private readonly tx: TransactionPort) {}

	async exec(sessionId: number, email: string): Promise<Booking> {
		return this.tx.withTransaction(async ({ bookings, sessions }) => {
			const maxSpots = await sessions.getMaxSpots(sessionId);
			if (maxSpots == null) throw new SessionNotFoundError("Session not found");
			const dup = await bookings.findBySessionAndEmail(sessionId, email);
			if (dup) throw new DuplicateBookingError("Already booked");
			const current = await bookings.countBySession(sessionId);
			if (current >= maxSpots) throw new ClassFullError("Class is full");
			return bookings.create(sessionId, email);
		});
	}
}
