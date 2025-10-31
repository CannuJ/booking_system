import { Prisma, PrismaClient } from "@prisma/client";
import type { BookingRepository } from "../../application/ports";

type DB = PrismaClient | Prisma.TransactionClient;

export class PrismaBookingRepository implements BookingRepository {
	constructor(private prisma: DB) {}
	findBySessionAndEmail(sessionId: number, email: string) {
		return this.prisma.booking.findUnique({
			where: { sessionId_email: { sessionId, email } },
		});
	}
	countBySession(sessionId: number) {
		return this.prisma.booking.count({ where: { sessionId } });
	}
	create(sessionId: number, email: string) {
		return this.prisma.booking.create({
			data: { sessionId, email },
			select: { id: true, sessionId: true, email: true },
		});
	}
}
