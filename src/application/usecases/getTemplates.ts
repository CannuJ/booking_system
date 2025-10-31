import type { TemplateRepository } from "../ports";
import type { Template, DanceType } from "../../domain/entities";

export class GetTemplates {
	constructor(private readonly templates: TemplateRepository) {}

	async exec(type?: DanceType): Promise<Template[]> {
		return await this.templates.findByType(type);
	}
}
