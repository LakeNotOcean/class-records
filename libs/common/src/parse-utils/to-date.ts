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

export function toYYYMMDD(date: Date): Result<string> {
	if (isValidDate(date)) {
		return createErrorResult('value is not valid date');
	}
	return createSuccessResult(date.toISOString().slice(0, 10));
}
