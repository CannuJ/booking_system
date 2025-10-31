import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";

import { isValidEmail } from "../utils/helpers";

const prisma = new PrismaClient();

interface BookingParams {
	sessionId: string;
}
interface BookingBody {
	email: string;
}
interface BookingSuccess {
	success: true;
	booking: { id: number; sessionId: number; email: string };
}
interface BookingError {
	success: false;
	error: string;
}

const bookingRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.post<{
		Params: BookingParams;
		Body: BookingBody;
		Reply: BookingSuccess | BookingError;
	}>(
		"/bookings/:sessionId",
		async (
			request: FastifyRequest<{ Params: BookingParams; Body: BookingBody }>,
			reply: FastifyReply
		) => {
			// sessionId validation
			const sessionId = Number(request.params.sessionId);
			if (!Number.isInteger(sessionId) || sessionId < 0) {
				return reply.code(400).send({ success: false, error: `Bad sessionId` });
			}

			// email validation
			const email = (request.body?.email || "").trim().toLowerCase();
			if (!email || !isValidEmail(email)) {
				return reply.code(400).send({ success: false, error: `Invalid email` });
			}

			try {
				// check session exists
				const session = await prisma.classSession.findUnique({
					where: { id: sessionId },
					select: {
						id: true,
						maxSpots: true,
						_count: { select: { bookings: true } },
					},
				});
				if (!session) {
					throw new Error(`Session not found`);
				}

				// check duplicate bookings by email for session
				const emailExists = await prisma.booking.findUnique({
					where: { classSessionId_email: { classSessionId: sessionId, email } },
					select: { id: true },
				});
				if (emailExists) {
					throw new Error(`Email already registered for this class`);
				}

				// check capacity
				if (session._count.bookings >= session.maxSpots) {
					throw new Error(
						`Class is fully booked: ${session._count.bookings}/${session.maxSpots}`
					);
				}

				// create booking
				const newBooking = await prisma.booking.create({
					data: { classSessionId: sessionId, email },
					select: { id: true, classSessionId: true, email: true },
				});
				return reply.code(201).send({ success: true, booking: newBooking });
			} catch (error: any) {
				const message = error?.message ?? "Error";
				request.log.error(error);
				return reply.code(500).send({ success: false, error: message });
			}
		}
	);
};

export default bookingRoutes;
