import type { SessionRepository } from "../ports";
import type { SessionWithCount, DanceType } from "../../domain/entities";

export class GetSessions {
	constructor(private readonly sessions: SessionRepository) {}

	async exec(
		from: string,
		to: string,
		type?: DanceType
	): Promise<SessionWithCount[]> {
		return await this.sessions.getSessionsWithRemainingSpots(from, to, type);
	}
}
