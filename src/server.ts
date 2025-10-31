import fastify from "fastify";
import { danceTemplate, danceSession, danceBooking } from "./routes";

const app = fastify({ logger: true });

app.register(danceTemplate, { prefix: "/api" }); // view templates
app.register(danceSession, { prefix: "/api" }); // view sessions
app.register(danceBooking, { prefix: "/api" }); // book sessions

app
	.listen({ port: 3000 })
	.then((address) => app.log.info(`Server listening at ${address}`))
	.catch((err) => {
		app.log.error(err);
		process.exit(1);
	});
