import type {
	BookingRepository,
	SessionRepository,
	TransactionPort,
} from "../ports";
import {
	ClassFullError,
	DuplicateBookingError,
	SessionNotFoundError,
} from "../../domain/errors";
import type { Booking } from "../../domain/entities";

export class BookClass {
	constructor(
		private readonly bookings: BookingRepository,
		private readonly sessions: SessionRepository,
		private readonly tx: TransactionPort
	) {}

	async exec(sessionId: number, email: string): Promise<Booking> {
		return this.tx.runInTransaction(async () => {
			const maxSpots = await this.sessions.getMaxSpots(sessionId);
			if (maxSpots == null) throw new SessionNotFoundError("Session not found");
			const dup = await this.bookings.findBySessionAndEmail(sessionId, email);
			if (dup) throw new DuplicateBookingError("Already booked");
			const current = await this.bookings.countBySession(sessionId);
			if (current >= maxSpots) throw new ClassFullError("Class is full");
			return this.bookings.create(sessionId, email);
		});
	}
}
