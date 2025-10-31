// used to normalise dates such as 2025-4-8 -> 2025-04-08 (4th April) for consistency
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
export const yyyyMmDd = (d: Date) =>
	`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const isYyyyMmDd = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
