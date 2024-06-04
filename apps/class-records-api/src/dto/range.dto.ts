import {
	createErrorResult,
	createSuccessResult,
	Result,
	StatusEnum,
	toInteger,
} from '@common';
import { INT_REGEX } from '../constants/regex.constant';
import { intValueDec } from '../decorators/values-decorators/int-value.decorator';
import { getArrayFromString } from '../utils/get-array-from-string';

export class RangeDto {
	@intValueDec({ isRequired: true })
	start: number;
	@intValueDec({ isRequired: true })
	end: number;
	constructor(args: Required<RangeDto>) {
		Object.assign(this, args);
	}
}

export function getRangeFromString(rangeString: string): Result<RangeDto> {
	const numberArr = getArrayFromString(rangeString, 2, INT_REGEX, toInteger);
	if (numberArr.getStatus() == StatusEnum.Error) {
		return createErrorResult(numberArr.getErrorMessage());
	}
	const resultData = numberArr.unwrap();
	if (resultData.length != 2) {
		return createErrorResult('there are not two numbers in the string');
	}
	if (resultData[0] > resultData[1]) {
		return createErrorResult(
			'the first value in the range must be greater than the second',
		);
	}
	return createSuccessResult(
		new RangeDto({
			start: resultData[0],
			end: resultData[1],
		}),
	);
}
