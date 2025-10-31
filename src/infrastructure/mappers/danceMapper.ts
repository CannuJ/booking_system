import {
	DanceType as PDanceType,
	DanceLevel as PDanceLevel,
} from "@prisma/client";
import { DanceType, DanceLevel } from "../../domain/entities";

// Prisma -> Domain
export const prismaToDomainDanceType: Record<PDanceType, DanceType> = {
	[PDanceType.SALSA]: DanceType.SALSA,
	[PDanceType.BACHATA]: DanceType.BACHATA,
	[PDanceType.REGGAETON]: DanceType.REGGAETON,
};

export const prismaToDomainDanceLevel: Record<PDanceLevel, DanceLevel> = {
	[PDanceLevel.L1]: DanceLevel.L1,
	[PDanceLevel.L2]: DanceLevel.L2,
	[PDanceLevel.L3]: DanceLevel.L3,
	[PDanceLevel.NONE]: DanceLevel.NONE,
};

// Domain -> Prisma
export const domainToPrismaDanceType: Record<DanceType, PDanceType> = {
	[DanceType.SALSA]: PDanceType.SALSA,
	[DanceType.BACHATA]: PDanceType.BACHATA,
	[DanceType.REGGAETON]: PDanceType.REGGAETON,
};
