import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";

import {
	type DayIndex,
	type ValidDanceType,
	DANCE_TO_ENUM,
	getDayOfWeek,
	isValidDanceType,
	isYyyyMmDd,
	yyyyMmDd,
} from "../utils/helpers";

const prisma = new PrismaClient();

interface SessionsQuery {
	type?: ValidDanceType; // "salsa" | "bachata" | "reggaeton" | "any"
	from?: string; // "YYYY-MM-DD" (inclusive)
	to?: string; // "YYYY-MM-DD" (inclusive)
}

type SessionOut = {
	id: number;
	date: string; // "YYYY-MM-DD (Monday)"
	startTime: string; // "18:30"
	maxSpots: number;
	spotsRemaining: number;
	type: string; // "salsa" | "bachata" | "reggaeton"
	level: string; // "NONE" | "L1" | "L2" | "L3"
};

interface SessionsResponse {
	sessions: SessionOut[];
}

const sessionRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.get<{ Querystring: SessionsQuery; Reply: SessionsResponse }>(
		"/sessions",
		async (
			request: FastifyRequest<{ Querystring: SessionsQuery }>,
			reply: FastifyReply
		) => {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const defaultFrom = yyyyMmDd(today);
			const defaultTo = yyyyMmDd(
				new Date(today.getFullYear(), today.getMonth(), today.getDate() + 27)
			);

			const rawType = request.query.type ?? "any";
			const from = request.query.from ?? defaultFrom;
			const to = request.query.to ?? defaultTo;

			if (!isValidDanceType(rawType)) {
				return reply.code(400).send({ sessions: [] });
			}
			if (!isYyyyMmDd(from) || !isYyyyMmDd(to) || from > to) {
				return reply.code(400).send({ sessions: [] });
			}

			// where clause
			const where = {
				date: { gte: from, lte: to },
				...(rawType === "any"
					? {}
					: { template: { type: DANCE_TO_ENUM[rawType] } }),
			};

			// fetch with bookings count to compute spotsRemaining
			const rows = await prisma.classSession.findMany({
				where,
				orderBy: [{ date: "asc" }, { startTime: "asc" }],
				select: {
					id: true,
					date: true,
					startTime: true,
					length: true,
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

			const sessions: SessionOut[] = rows.map((s) => ({
				id: s.id,
				date: `${s.date} (${getDayOfWeek(
					new Date(s.date).getDay() as DayIndex
				)})`,
				startTime: s.startTime,
				maxSpots: s.maxSpots,
				spotsRemaining: s.maxSpots - s._count.bookings,
				type: s.template.type,
				level: s.template.level,
			}));

			return reply.code(200).send({ sessions });
		}
	);
};

export default sessionRoutes;
