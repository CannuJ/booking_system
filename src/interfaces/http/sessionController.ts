import type { FastifyPluginAsync } from "fastify";
import type { GetSessions } from "../../application/usecases/getSessions";
import { DANCE_TO_ENUM } from "../../domain/constants/dance";
import type { SessionWithRemainingSpots } from "../../domain/entities";
import { isYyyyMmDd, yyyyMmDd } from "../../domain/utils/date";
import { getDayOfWeek, type DayIndex } from "../../domain/utils/dateNames";
import { isValidDanceType } from "../../domain/utils/validation";

export const sessionController =
	(useCase: GetSessions): FastifyPluginAsync =>
	async (f) => {
		f.get<{ Querystring: { type?: string; from?: string; to?: string } }>(
			"/sessions",
			async (request, reply) => {
				// provision from-to date range
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				const defaultFrom = yyyyMmDd(today);
				const defaultTo = yyyyMmDd(
					new Date(today.getFullYear(), today.getMonth(), today.getDate() + 27)
				);
				const from = request.query.from ?? defaultFrom;
				const to = request.query.to ?? defaultTo;

				// validate type
				const rawType = request.query.type ?? "any";

				if (!isValidDanceType(rawType)) {
					return reply.code(400).send({ sessions: [] });
				}
				if (!isYyyyMmDd(from) || !isYyyyMmDd(to) || from > to) {
					return reply.code(400).send({ sessions: [] });
				}

				const type = rawType === "any" ? undefined : DANCE_TO_ENUM[rawType];

				try {
					const rawSessions = await useCase.exec(from, to, type);

					const sessions: SessionWithRemainingSpots[] = rawSessions.map(
						(s) => ({
							id: s.id,
							date: `${s.date} (${getDayOfWeek(
								new Date(s.date).getDay() as DayIndex
							)})`,
							startTime: s.startTime,
							maxSpots: s.maxSpots,
							spotsRemaining: s.maxSpots - s._count.bookings,
							type: s.template.type,
							level: s.template.level,
						})
					);
					return reply.code(200).send({ success: true, sessions });
				} catch (e) {
					request.log.error(e);
					return reply
						.code(500)
						.send({ success: false, error: "Internal server error" });
				}
			}
		);
	};
