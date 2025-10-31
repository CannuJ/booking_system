import type { FastifyPluginAsync } from "fastify";
import { GetTemplates } from "../../application/usecases/getTemplates";
import { DANCE_TO_ENUM } from "../../domain/constants/dance";
import { isValidDanceType } from "../../domain/utils/validation";

export const templateController =
	(useCase: GetTemplates): FastifyPluginAsync =>
	async (f) => {
		f.get<{ Querystring: { type?: string } }>(
			"/templates",
			async (request, reply) => {
				const rawType = request.query.type ?? "any";

				if (!isValidDanceType(rawType)) {
					return reply.code(400).send({ classTemplates: [] });
				}

				const type = rawType === "any" ? undefined : DANCE_TO_ENUM[rawType];

				try {
					const templates = await useCase.exec(type);
					return reply.code(200).send({ success: true, templates });
				} catch (e) {
					request.log.error(e);
					return reply
						.code(500)
						.send({ success: false, error: "Internal server error" });
				}
			}
		);
	};
