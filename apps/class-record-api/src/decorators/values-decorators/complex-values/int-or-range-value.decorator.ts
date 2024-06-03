import { ResultEnum, toInteger } from '@common';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { TransformWithValidationErrorDec } from 'libs/common/src/decorators/transform-validation-exception.decorator';
import {
	setValidationErrorConstraint,
	ValidationException,
} from 'libs/common/src/exceptions';
import { getIntRangeValueDescription } from '../../../api-descriptions/int-range-value.description';
import { IS_NOT_A_STRING } from '../../../constants/error-constraints.constant';
import { getRangeFromString } from '../../../dto/range.dto';
import { intValueDecOptions } from '../int-value.decorator';

export function intOrRangeValueDec(opt: intValueDecOptions) {
	const rangeDescr = getIntRangeValueDescription();
	rangeDescr.description = rangeDescr.description
		? rangeDescr.description + ' or it could be one element'
		: 'interger string';
	return applyDecorators(
		ApiProperty({
			...rangeDescr,
			required: opt.isRequired,
		}),
		opt.isRequired ? IsNotEmpty() : IsOptional(),
		ValidateIf((_obj, value) => value != null && value != undefined),
		TransformWithValidationErrorDec((_key, value, error) => {
			if (typeof value !== 'string') {
				setValidationErrorConstraint(error, IS_NOT_A_STRING);
				throw new ValidationException([error]);
			}

			const rangeFromString = getRangeFromString(value);
			if (rangeFromString.result == ResultEnum.Success) {
				return rangeFromString.resultData;
			}

			const parseIntegerRes = toInteger(value, 0);
			if (parseIntegerRes.result == ResultEnum.Success) {
				return parseIntegerRes.resultData;
			}

			setValidationErrorConstraint(
				error,
				...[
					{ key: 'rangeFromString', message: rangeFromString.errorMessage },
					{ key: 'parseIntergerRes', message: parseIntegerRes.errorMessage },
				],
			);
			throw new ValidationException([error]);
		}),
	);
}
