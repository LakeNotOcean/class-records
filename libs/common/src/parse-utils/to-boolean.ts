import { createSuccessResult, Result } from '../result';

export function toIntBoolean(bool: boolean): Result<number> {
	if (bool) {
		return createSuccessResult(1);
	}
	return createSuccessResult(0);
}
