import { ResultEnum, toInteger } from '@common';
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
import { getIntRangeValueDescription } from '../api-descriptions/int-range-value.description';
import { getRangeFromString } from '../dto/range.dto';
import { intValueDecOptions } from './int-value.decorator';

export function intOrRangeValueDec(opt: intValueDecOptions) {
	const rangeDescr = getIntRangeValueDescription();
	return applyDecorators(
		ApiProperty({
			type: Object,
			oneOf: [
				{ ...rangeDescr },
				{
					type: 'integer',
					example: 3,
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

			const parseIntegerRes = toInteger(value, 0);
			if (parseIntegerRes.result == ResultEnum.Success) {
				return parseIntegerRes.resultData;
			}

			const rangeFromString = getRangeFromString(value);
			if (rangeFromString.result == ResultEnum.Success) {
				return rangeFromString.resultData;
			}

			const error = new ValidationError();
			error.property = value;
			throw new ValidationException([error]);
		}),
	);
}
