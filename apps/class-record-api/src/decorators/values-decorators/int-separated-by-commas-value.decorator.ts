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
import {
	setValidationErrorConstraint,
	ValidationException,
} from 'libs/common/src/exceptions';
import { getIntSeparatedByCommasDescription } from '../../api-descriptions/int-seperated-by-commas.description';
import { IS_NOT_A_STRING } from '../../constants/error-constraints';
import { INT_REGEX } from '../../constants/regex.constant';
import { getArrayFromString } from '../../utils/get-array-from-string';
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
		Transform(({ key, value }) => {
			const error = new ValidationError();
			error.property = key;

			if (typeof value !== 'string') {
				setValidationErrorConstraint(error, IS_NOT_A_STRING);
				throw new ValidationException([error]);
			}

			const parseResult = getArrayFromString(value, 20, INT_REGEX, toInteger);
			if (parseResult.result == ResultEnum.Success) {
				return parseResult.resultData;
			}

			setValidationErrorConstraint(error, {
				key: 'parseResult',
				message: parseResult.errorMessage,
			});
			throw new ValidationException([error]);
		}),
	);
}
