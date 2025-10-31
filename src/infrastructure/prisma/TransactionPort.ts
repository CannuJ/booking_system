import { Prisma, PrismaClient } from "@prisma/client";
import type { TransactionPort } from "../../application/ports";

// https://www.prisma.io/docs/orm/prisma-client/queries/transactions
export class PrismaTransactionPort implements TransactionPort {
	constructor(private prisma: PrismaClient) {}
	runInTransaction<T>(fn: () => Promise<T>): Promise<T> {
		return this.prisma.$transaction(async () => fn(), {
			isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // default for SQLite
		});
	}
}
