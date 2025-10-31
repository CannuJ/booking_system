import { PrismaClient } from "@prisma/client";
import { DanceType, type SessionWithCount } from "../../domain/entities";
import type { SessionRepository } from "../../application/ports";

import {
	prismaToDomainDanceType,
	prismaToDomainDanceLevel,
	domainToPrismaDanceType,
} from "../mappers/danceMapper";

export class PrismaSessionRepository implements SessionRepository {
	constructor(private prisma: PrismaClient) {}
	async getMaxSpots(sessionId: number) {
		const s = await this.prisma.session.findUnique({
			where: { id: sessionId },
			select: { maxSpots: true },
		});
		return s?.maxSpots ?? null;
	}
	async getSessionsWithRemainingSpots(
		from: string,
		to: string,
		type?: DanceType
	): Promise<SessionWithCount[]> {
		// convert domain type to prisma type
		const prismaType = type ? domainToPrismaDanceType[type] : undefined;
		// where clause
		const where = {
			date: { gte: from, lte: to },
			...(prismaType ? { template: { type: prismaType } } : {}),
		};
		// fetch with bookings count to compute spotsRemaining
		const dbRows = await this.prisma.session.findMany({
			where,
			orderBy: [{ date: "asc" }, { startTime: "asc" }],
			select: {
				id: true,
				date: true,
				startTime: true,
				maxSpots: true,
				templateId: true,
				template: {
					select: {
						type: true,
						level: true,
					},
				},
				_count: {
					select: { bookings: true },
				},
			},
		});
		return dbRows.map((r) => ({
			id: r.id,
			date: r.date,
			startTime: r.startTime,
			maxSpots: r.maxSpots,
			templateId: r.templateId,
			template: {
				type: prismaToDomainDanceType[r.template.type],
				level: prismaToDomainDanceLevel[r.template.level],
			},
			_count: {
				bookings: r._count.bookings,
			},
		}));
	}
}
