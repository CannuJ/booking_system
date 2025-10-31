import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient, DanceType, DanceLevel } from "@prisma/client";

import {
	type ValidDanceType,
	isValidDanceType,
	DANCE_TO_ENUM,
} from "../utils/helpers";

const prisma = new PrismaClient();

interface TemplateQuery {
	type?: ValidDanceType;
}

interface TemplateResponse {
	classTemplates: {
		id: number;
		type: DanceType;
		level: DanceLevel;
		defaultLength: number;
		defaultMaxSpots: number;
	}[];
}

const templateRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.get<{
		Querystring: TemplateQuery;
		Reply: TemplateResponse;
	}>(
		"/templates",
		async (
			request: FastifyRequest<{ Querystring: TemplateQuery }>,
			reply: FastifyReply
		) => {
			const raw = request.query.type ?? "any";

			if (!isValidDanceType(raw)) {
				return reply.code(400).send({ classTemplates: [] });
			}

			const where = raw === "any" ? {} : { type: DANCE_TO_ENUM[raw] };

			const classTemplates = await prisma.classTemplate.findMany({
				where,
				orderBy: [{ type: "asc" }, { level: "asc" }, { defaultLength: "asc" }],
				select: {
					id: true,
					type: true,
					level: true,
					defaultLength: true,
					defaultMaxSpots: true,
				},
			});

			return reply.code(200).send({ classTemplates });
		}
	);
};

export default templateRoutes;
