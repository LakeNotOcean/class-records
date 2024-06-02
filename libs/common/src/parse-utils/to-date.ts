import { createErrorResult, createSuccessResult, Result } from '@common';

export function toDate(value?: string): Result<Date> {
	if (value == null || value == undefined) {
		return createErrorResult('value is not defined');
	}
	const parseResult = new Date(value);
	if (parseResult) {
		return createSuccessResult(parseResult);
	}
	return createErrorResult('value is not date');
}
