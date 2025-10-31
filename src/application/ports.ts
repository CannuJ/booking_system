import type {
	Template,
	SessionWithCount,
	Booking,
	DanceType,
} from "../domain/entities";

// Template
export interface TemplateRepository {
	findByType(type?: DanceType): Promise<Template[]>;
}

// Session
export interface SessionRepository {
	getMaxSpots(sessionId: number): Promise<number | null>;
	getSessionsWithRemainingSpots(
		from: string,
		to: string,
		type?: DanceType
	): Promise<SessionWithCount[]>;
}

// SessionBooking
export interface BookingRepository {
	findBySessionAndEmail(
		sessionId: number,
		email: string
	): Promise<Booking | null>;
	countBySession(sessionId: number): Promise<number>;
	create(sessionId: number, email: string): Promise<Booking>;
}

// Prisma Transaction
export interface TransactionPort {
	withTransaction<T>(
		fn: (deps: {
			bookings: BookingRepository;
			sessions: SessionRepository;
			templates: TemplateRepository;
		}) => Promise<T>
	): Promise<T>;
}
