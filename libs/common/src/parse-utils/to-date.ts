import { createErrorResult, createSuccessResult, Result } from '@common';

export function toDate(value?: string): Result<Date> {
	if (value == null || value == undefined) {
		return createErrorResult('value is not defined');
	}
	const parseResult = new Date(value);
	if (isValidDate(parseResult)) {
		return createSuccessResult(parseResult);
	}
	return createErrorResult('value is not a valid date');
}

export function isValidDate(date: Date): boolean {
	return date instanceof Date && !isNaN(date.getTime());
}

export function toYYYYMMDD(date: Date): Result<string> {
	if (!isValidDate(date)) {
		return createErrorResult('value is not valid date');
	}
	const offset = date.getTimezoneOffset();
	const dateWithTimezone = new Date(date.getTime() + offset * 60 * 1000);
	return createSuccessResult(dateWithTimezone.toISOString().slice(0, 10));
}
