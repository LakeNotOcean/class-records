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
import { getIntSeparatedByCommasDescription } from '../api-descriptions/int-seperated-by-commas.description';
import { INT_REGEX } from '../constants/regex';
import { getArrayFromString } from '../utils/get-array-from-string';
import { intValueDecOptions } from './int-value.decorator';

export function intSeparatedByCommasValueDec(opt: intValueDecOptions) {
	const apiDescr = getIntSeparatedByCommasDescription();
	return applyDecorators(
		ApiProperty({
			...apiDescr,
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
			const parseResult = getArrayFromString(value, 20, INT_REGEX, toInteger);
			if (parseResult.result == ResultEnum.Success) {
				return parseResult.resultData;
			}

			const error = new ValidationError();
			error.property = value;
			throw new ValidationException([error]);
		}),
	);
}
