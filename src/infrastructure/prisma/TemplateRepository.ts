import { Prisma, PrismaClient } from "@prisma/client";
import type { TemplateRepository } from "../../application/ports";
import { DanceType, type Template } from "../../domain/entities";
import {
	prismaToDomainDanceType,
	prismaToDomainDanceLevel,
	domainToPrismaDanceType,
} from "../mappers/danceMapper";

type DB = PrismaClient | Prisma.TransactionClient;

export class PrismaTemplateRepository implements TemplateRepository {
	constructor(private prisma: DB) {}
	async findByType(type?: DanceType): Promise<Template[]> {
		// convert domain type to prisma type
		const prismaType = type ? domainToPrismaDanceType[type] : undefined;

		const templates = await this.prisma.template.findMany({
			where: prismaType ? { type: prismaType } : {},
			select: {
				id: true,
				type: true,
				level: true,
				defaultLength: true,
				defaultMaxSpots: true,
			},
		});

		return templates.map((t) => ({
			id: t.id,
			type: prismaToDomainDanceType[t.type],
			level: prismaToDomainDanceLevel[t.level],
			defaultLength: t.defaultLength,
			defaultMaxSpots: t.defaultMaxSpots,
		}));
	}
}
