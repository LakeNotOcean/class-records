import { createErrorResult, createSuccessResult, Result } from '@common';
import { IntValueDecorator } from '../decorators/int-value.decorator';

export class RangeDto {
	@IntValueDecorator({ isRequired: true })
	start: number;
	@IntValueDecorator({ isRequired: true })
	end: number;
	constructor(args: Required<RangeDto>) {
		Object.assign(this, args);
	}
}

export function getRangeFromString(rangeString: string): Result<RangeDto> {
	if (!/^[1-9]([0-9]+)?,[1-9]([0-9]+)?$/.test(rangeString)) {
		return createErrorResult();
	}
	const [start, end] = rangeString.split(',');
	return createSuccessResult(
		new RangeDto({ start: parseInt(start), end: parseInt(end) }),
	);
}
