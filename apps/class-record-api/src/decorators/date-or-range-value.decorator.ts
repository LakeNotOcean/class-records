import { ResultEnum, toDate } from '@common';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	IsNotEmpty,
	IsOptional,
	ValidateIf,
	ValidationError,
} from 'class-validator';
import { ValidationException } from 'libs/common/src/exceptions';
import { getDateRangeValueDescription } from '../api-descriptions/date-range-value.description';
import { DATE_REGEX } from '../constants/regex';
import { getArrayFromString } from '../utils/get-array-from-string';
import { dateValueDecOptions } from './date-value.decorator';

export function dateOrRangeValueDec(opt: dateValueDecOptions) {
	const rangeDescr = getDateRangeValueDescription();
	return applyDecorators(
		ApiProperty({
			type: Object,
			oneOf: [
				{ ...rangeDescr },
				{
					type: 'date',
					example: '2021-02-22',
				},
			],
			required: opt.isRequired,
		}),
		opt.isRequired ? IsNotEmpty() : IsOptional(),
		ValidateIf((_obj, value) => value != null && value != undefined),
		Transform(({ value }) => {
			if (typeof value !== 'string') {
				const error = new ValidationError();
				error.property = value;
				error.value = 'test';
				throw new ValidationException([error]);
			}
			const parseSingleDateResult = toDate(value);
			if (parseSingleDateResult.result != ResultEnum.Error) {
				return parseSingleDateResult.errorMessage;
			}
			const parseResult = getArrayFromString(value, 2, DATE_REGEX, toDate);
			if (
				parseResult.result == ResultEnum.Success &&
				parseResult.resultData.length == 2
			) {
				return parseResult.resultData;
			}

			const error = new ValidationError();
			error.property = value;
			error.value = 'test_value';
			throw new ValidationException([error]);
		}),
	);
}
