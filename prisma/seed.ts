// prisma/seed.ts
import { PrismaClient, DanceType, DanceLevel } from "@prisma/client";
const prisma = new PrismaClient();

// helper functions
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const yyyyMmDd = (d: Date) =>
	`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// class templates
type TemplateSeed = {
	id: number;
	type: DanceType;
	level: DanceLevel;
	defaultLength: number;
	defaultMaxSpots: number;
};

const classTemplates: TemplateSeed[] = [
	{
		id: 0,
		type: DanceType.SALSA,
		level: DanceLevel.L1,
		defaultLength: 60,
		defaultMaxSpots: 20,
	},
	{
		id: 1,
		type: DanceType.SALSA,
		level: DanceLevel.L2,
		defaultLength: 60,
		defaultMaxSpots: 20,
	},
	{
		id: 2,
		type: DanceType.SALSA,
		level: DanceLevel.L3,
		defaultLength: 60,
		defaultMaxSpots: 20,
	},
	{
		id: 3,
		type: DanceType.BACHATA,
		level: DanceLevel.L1,
		defaultLength: 60,
		defaultMaxSpots: 20,
	},
	{
		id: 4,
		type: DanceType.BACHATA,
		level: DanceLevel.L2,
		defaultLength: 60,
		defaultMaxSpots: 20,
	},
	{
		id: 5,
		type: DanceType.REGGAETON,
		level: DanceLevel.NONE,
		defaultLength: 60,
		defaultMaxSpots: 20,
	},
];

const templateCache = new Map<
	number,
	{ id: number; defaultLength: number; defaultMaxSpots: number }
>();

// weekly schedule (Mon - Friday)
const schedule: {
	day: number;
	time: string;
	templateCode: number;
	length?: number; // optional to override length
	maxSpots?: number; // optional to override max spots
}[] = [
	{ day: 1, time: "18:30", templateCode: 3 }, // Monday Bachata 1
	{ day: 1, time: "19:30", templateCode: 4 }, // Monday Bachata 2
	{ day: 1, time: "20:30", templateCode: 2 }, // Monday Salsa 3
	{ day: 2, time: "18:30", templateCode: 0 }, // Tuesday Salsa 1
	{ day: 2, time: "19:30", templateCode: 1 }, // Tuesday Salsa 2
	{ day: 2, time: "20:30", templateCode: 5 }, // Tuesday Reggaeton
	{ day: 3, time: "18:30", templateCode: 3 }, // Wednesday Bachata 1
	{ day: 3, time: "19:30", templateCode: 4 }, // Wednesday Bachata 2
	{ day: 3, time: "20:30", templateCode: 2 }, // Wednesday Salsa 3
	{ day: 4, time: "18:30", templateCode: 0 }, // Thursday Salsa 1
	{ day: 4, time: "19:30", templateCode: 1 }, // Thursday Salsa 2
	{ day: 5, time: "18:30", templateCode: 5 }, // Friday Reggaeton
	{ day: 5, time: "19:30", templateCode: 2 }, // Friday Salsa 3
	{ day: 0, time: "10:00", templateCode: 5, length: 45, maxSpots: 3 }, // Sunday Reggaeton 45min 3 spots
];

// TODO: dummy bookings (add sessions with lower max spots to make easier)

async function main() {
	// 1) Upsert templates

	for (const t of classTemplates) {
		const tpl = await prisma.classTemplate.upsert({
			where: {
				type_level_defaultLength: {
					type: t.type,
					level: t.level,
					defaultLength: t.defaultLength,
				},
			},
			update: {},
			create: {
				type: t.type,
				level: t.level,
				defaultLength: t.defaultLength,
				defaultMaxSpots: t.defaultMaxSpots,
			},
		});

		templateCache.set(t.id, {
			id: tpl.id,
			defaultLength: tpl.defaultLength,
			defaultMaxSpots: tpl.defaultMaxSpots,
		});
	}

	// 2) Generate sessions for next N days (including today)
	const DAYS = 365; // populate next year
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	for (let i = 0; i < DAYS; i++) {
		const d = new Date(today);
		d.setDate(today.getDate() + i);

		const dayNum = d.getDay();
		const dateStr = yyyyMmDd(d);

		// sessions for given weekday
		const sessions = schedule.filter((s) => s.day === dayNum);

		for (const s of sessions) {
			const tpl = templateCache.get(s.templateCode);
			if (!tpl) {
				throw new Error(
					`Missing template in DB for templateCode(${s.templateCode})`
				);
			}

			// Upsert by unique (templateId, date, startTime)
			await prisma.classSession.upsert({
				where: {
					templateId_date_startTime: {
						templateId: tpl.id,
						date: dateStr,
						startTime: s.time,
					},
				},
				update: {
					// UNCOMMENT if we want to refresh defaults on seed reruns
					// length: s.length ?? tpl.defaultLength,
					// maxSpots: s.maxSpots ?? tpl.defaultMaxSpots,
				},
				create: {
					templateId: tpl.id,
					date: dateStr,
					startTime: s.time,
					length: s.length ?? tpl.defaultLength,
					maxSpots: s.maxSpots ?? tpl.defaultMaxSpots,
				},
			});
		}
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
