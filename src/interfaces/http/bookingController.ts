import type { FastifyPluginAsync } from "fastify";
import { BookClass } from "../../application/usecases/bookClass";
import {
	ClassFullError,
	DuplicateBookingError,
	SessionNotFoundError,
} from "../../domain/errors";

export const bookingController =
	(useCase: BookClass): FastifyPluginAsync =>
	async (f) => {
		f.post<{ Params: { sessionId: string }; Body: { email: string } }>(
			"/bookings/:sessionId",
			async (req, reply) => {
				const sessionId = Number(req.params.sessionId);
				const email = (req.body?.email ?? "").trim().toLowerCase();
				if (!Number.isInteger(sessionId) || !email) {
					return reply
						.code(400)
						.send({ success: false, error: "Invalid input" });
				}
				try {
					const booking = await useCase.exec(sessionId, email);
					return reply.code(201).send({ success: true, booking });
				} catch (e) {
					if (e instanceof SessionNotFoundError)
						return reply.code(404).send({ success: false, error: e.message });
					if (e instanceof ClassFullError)
						return reply.code(409).send({ success: false, error: e.message });
					if (e instanceof DuplicateBookingError)
						return reply.code(409).send({ success: false, error: e.message });
					req.log.error(e);
					return reply
						.code(500)
						.send({ success: false, error: "Internal server error" });
				}
			}
		);
	};
