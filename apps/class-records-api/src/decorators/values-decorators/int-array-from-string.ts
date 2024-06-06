import { StatusEnum, toInteger } from '@common';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { TransformWithValidationErrorDec } from 'libs/common/src/decorators/transform-validation-exception.decorator';
import {
	setValidationErrorConstraint,
	ValidationException,
} from 'libs/common/src/exceptions';
import { getIntArrayFromStringDescription } from '../../api-descriptions/int-array-from-string.description';
import { IS_NOT_A_STRING } from '../../constants/error-constraints.constant';
import { INT_REGEX } from '../../constants/regex.constant';
import { getArrayFromString } from '../../utils/get-array-from-string';
import { intValueDecOptions } from './int-value.decorator';

export function intArrayFromStringDec(opt: intValueDecOptions) {
	const apiDescr = getIntArrayFromStringDescription();
	return applyDecorators(
		ApiProperty({
			...apiDescr,
			required: opt.isRequired,
		}),
		opt.isRequired ? IsNotEmpty() : IsOptional(),
		ValidateIf((_obj, value) => value != null && value != undefined),
		TransformWithValidationErrorDec((_key, value, error) => {
			if (typeof value !== 'string') {
				setValidationErrorConstraint(error, IS_NOT_A_STRING);
				throw new ValidationException([error]);
			}

			const parseResult = getArrayFromString(value, 20, INT_REGEX, toInteger);
			if (parseResult.getStatus() == StatusEnum.Success) {
				return parseResult.unwrap();
			}

			setValidationErrorConstraint(error, {
				key: 'parseResult',
				message: parseResult.getErrorMessage(),
			});
			throw new ValidationException([error]);
		}),
	);
}
