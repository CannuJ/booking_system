import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaBookingRepository } from "./BookingRepository";
import { PrismaSessionRepository } from "./SessionRepository";
import { PrismaTemplateRepository } from "./TemplateRepository";
import type { TransactionPort } from "../../application/ports";

// https://www.prisma.io/docs/orm/prisma-client/queries/transactions
export class PrismaTransactionPort implements TransactionPort {
	constructor(private prisma: PrismaClient) {}
	withTransaction<T>(
		fn: (deps: {
			bookings: PrismaBookingRepository;
			sessions: PrismaSessionRepository;
			templates: PrismaTemplateRepository;
		}) => Promise<T>
	): Promise<T> {
		return this.prisma.$transaction(
			async (tx) => {
				const bookings = new PrismaBookingRepository(tx);
				const sessions = new PrismaSessionRepository(tx);
				const templates = new PrismaTemplateRepository(tx);
				return fn({ bookings, sessions, templates });
			},
			{
				isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
				timeout: 15000,
				maxWait: 5000,
			}
		);
	}
}
