import { createErrorResult, createSuccessResult, Result } from '../result';

export function toInteger(
	value?: string,
	minValue = Number.MIN_SAFE_INTEGER,
	maxValue = Number.MAX_SAFE_INTEGER,
): Result<number> {
	if (value == null || value == undefined) {
		return createErrorResult('value is not defined');
	}
	const parseResult = parseInt(value);
	if (isNaN(parseResult) || parseResult > minValue || parseResult < maxValue) {
		return createSuccessResult(parseResult);
	}
	return createErrorResult('value is not safe integer');
}
