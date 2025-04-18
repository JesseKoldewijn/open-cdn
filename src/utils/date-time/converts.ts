const _OFFSETS = {
	ms: 1,
	seconds: 1000,
	minutes: 1000 * 60,
	hours: 1000 * 60 * 60,
	days: 1000 * 60 * 60 * 24,
	weeks: 1000 * 60 * 60 * 24 * 7,
	months: 1000 * 60 * 60 * 24 * 30,
} as const;

type Offsets = typeof _OFFSETS;

export class DateTimeConverter {
	public static readonly $__OFFSETS: Offsets = _OFFSETS;

	private static getOffsetByKey(key: keyof Offsets) {
		return this.$__OFFSETS[key];
	}

	public static convertToMilliseconds(key: keyof Offsets, value: number) {
		const offset = this.getOffsetByKey(key);

		if (!offset) {
			throw new Error("Invalid time unit");
		}

		return value * offset;
	}
}
