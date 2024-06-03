export enum timePostfix {
	year = 'y',
	month = 'm',
	day = 'd',
	minute = 'min',
	second = 's',
	millisecond = 'ms',
	hour = 'h',
}

export const toMilliseconds = (time: string): number => {
	const intValue = parseInt(time, 10);
	const measure = time.replace(intValue.toString(), '') as timePostfix;
	switch (measure) {
		case timePostfix.year:
			return intValue * 31556952000;
		case timePostfix.month:
			return intValue * 2629800000;
		case timePostfix.day:
			return intValue * 86400000;
		case timePostfix.minute:
			return intValue * 60000;
		case timePostfix.second:
			return intValue * 1000;
		case timePostfix.hour:
			return intValue * 3600000;
		case timePostfix.millisecond:
			return intValue;
		default:
			throw new Error('not implemented');
	}
};

export const toSeconds = (time: string): number => {
	const intValue = parseInt(time, 10);
	const measure = time.replace(intValue.toString(), '') as timePostfix;
	switch (measure) {
		case timePostfix.day:
			return intValue * 86400;
		case timePostfix.minute:
			return intValue * 60;
		case timePostfix.second:
			return intValue;
		case timePostfix.hour:
			return intValue * 3600;
		default:
			throw new Error('not implemented');
	}
};

export function addDays(date: Date, days: number): Date {
	const newDate = new Date(date);
	newDate.setDate(date.getDate() + days);
	return newDate;
}
