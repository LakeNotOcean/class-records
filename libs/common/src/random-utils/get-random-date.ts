export function getRandomDate(minDate: Date, maxDate: Date): Date {
	const minTimestamp = minDate.getTime();
	const maxTimestamp = maxDate.getTime();

	return new Date(minTimestamp + Math.random() * (maxTimestamp - minTimestamp));
}
