import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { PrismaBookingRepository } from "./infrastructure/prisma/BookingRepository";
import { PrismaSessionRepository } from "./infrastructure/prisma/SessionRepository";
import { PrismaTemplateRepository } from "./infrastructure/prisma/TemplateRepository";
import { PrismaTransactionPort } from "./infrastructure/prisma/TransactionPort";
import { BookClass } from "./application/usecases/bookClass";
import { GetTemplates } from "./application/usecases/getTemplates";
import { GetSessions } from "./application/usecases/getSessions";
import { bookingController } from "./interfaces/http/bookingController";
import { templateController } from "./interfaces/http/templateController";
import { sessionController } from "./interfaces/http/sessionController";

export function buildApp() {
	const app = Fastify({ logger: true });

	const prisma = new PrismaClient();

	const getTemplates = new GetTemplates(new PrismaTemplateRepository(prisma));
	const getSessions = new GetSessions(new PrismaSessionRepository(prisma));
	const bookClass = new BookClass(
		new PrismaBookingRepository(prisma),
		new PrismaSessionRepository(prisma),
		new PrismaTransactionPort(prisma)
	);

	app.register(templateController(getTemplates));
	app.register(sessionController(getSessions));
	app.register(bookingController(bookClass));

	return app;
}
