import {
	createErrorResult,
	createSuccessResult,
	Result,
	ResultEnum,
	toDate,
} from '@common';
import { DATE_REGEX } from '../constants/regex.constant';
import { dateValueDecorator } from '../decorators/values-decorators/date-value.decorator';
import { getArrayFromString } from '../utils/get-array-from-string';

export class DateRangeDto {
	@dateValueDecorator({ isRequired: true })
	start: Date;
	@dateValueDecorator({ isRequired: true })
	end: Date;
	constructor(args: Required<DateRangeDto>) {
		Object.assign(this, args);
	}
}

export function getDateRangeFromString(
	rangeString: string,
): Result<DateRangeDto> {
	const numberArr = getArrayFromString<Date>(
		rangeString,
		2,
		DATE_REGEX,
		toDate,
	);
	if (numberArr.result == ResultEnum.Error) {
		return createErrorResult(numberArr.errorMessage);
	}

	const resultData = numberArr.resultData;
	if (resultData.length != 2) {
		return createErrorResult('there are not two dates in the string');
	}
	if (resultData[0] > resultData[1]) {
		return createErrorResult(
			'the first value in the range greater than or equal to the second',
		);
	}
	return createSuccessResult(
		new DateRangeDto({
			start: resultData[0],
			end: resultData[1],
		}),
	);
}
