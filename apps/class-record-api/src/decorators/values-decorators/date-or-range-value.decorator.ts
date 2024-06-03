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
import {
	setValidationErrorConstraint,
	ValidationException,
} from 'libs/common/src/exceptions';
import { getDateRangeValueDescription } from '../../api-descriptions/date-range-value.description';
import { IS_NOT_A_STRING } from '../../constants/error-constraints';
import { getDateRangeFromString } from '../../dto/data-range.dto';
import { dateValueDecOptions } from './date-value.decorator';

export function dateOrRangeValueDec(opt: dateValueDecOptions) {
	const rangeDescr = getDateRangeValueDescription();
	rangeDescr.description = rangeDescr.description
		? rangeDescr.description + ' or it could be one date'
		: 'date string';
	return applyDecorators(
		ApiProperty({
			...rangeDescr,
			required: opt.isRequired,
		}),
		opt.isRequired ? IsNotEmpty() : IsOptional(),
		ValidateIf((_obj, value) => value != null && value != undefined),
		Transform(({ key, value }) => {
			const error = new ValidationError();
			error.property = key;

			if (typeof value !== 'string') {
				setValidationErrorConstraint(error, IS_NOT_A_STRING);
				throw new ValidationException([error]);
			}
			const parseSingleDateResult = toDate(value);
			if (parseSingleDateResult.result == ResultEnum.Success) {
				return parseSingleDateResult.resultData;
			}
			const parseResult = getDateRangeFromString(value);
			if (parseResult.result == ResultEnum.Success) {
				return parseResult.resultData;
			}

			setValidationErrorConstraint(
				error,
				...[
					{
						key: 'parseSingleDateResult',
						message: parseSingleDateResult.errorMessage,
					},
					{ key: 'parseResult', message: parseResult.errorMessage },
				],
			);
			throw new ValidationException([error]);
		}),
	);
}
