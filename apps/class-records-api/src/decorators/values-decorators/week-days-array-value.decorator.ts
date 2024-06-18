import { isNullOrUndefined } from '@common';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { TransformWithValidationErrorDec } from 'libs/common/src/decorators/transform-validation-exception.decorator';
import {
	setValidationErrorConstraint,
	ValidationException,
} from 'libs/common/src/exceptions';
import { getWeekDaysArrayValueDescription } from '../../api-descriptions/week-days-array-value.description';
import { IS_NOT_AN_ARRAY } from '../../constants/error-constraints.constant';
import { POSSIBLE_WEEK_DAYS_NUMBERS } from '../../constants/week-days.constant';

export type weekDaysArrayValueDecOptions = {
	isRequired: boolean;
};
export function weekDaysArrayValueDec(opt: weekDaysArrayValueDecOptions) {
	const rangeDescr = getWeekDaysArrayValueDescription();
	return applyDecorators(
		ApiProperty({
			...rangeDescr,
			required: opt.isRequired,
		}),
		opt.isRequired ? IsNotEmpty() : IsOptional(),
		ValidateIf((_obj, value) => !(!opt.isRequired && isNullOrUndefined(value))),
		TransformWithValidationErrorDec((key, value, error) => {
			if (!(value instanceof Array)) {
				setValidationErrorConstraint(error, IS_NOT_AN_ARRAY);
				throw new ValidationException([error]);
			}

			const daysOfWeeks = new Set(POSSIBLE_WEEK_DAYS_NUMBERS);
			for (const day of value) {
				if (typeof day !== 'number') {
					setValidationErrorConstraint(error, {
						key: 'isNotNumber',
						message: 'all values must be valid integers',
					});
					throw new ValidationException([error]);
				}
				if (!daysOfWeeks.has(day)) {
					setValidationErrorConstraint(error, {
						key: 'invalidInteger',
						message: 'integer is not in the correct format or is repeated',
					});
					throw new ValidationException([error]);
				}
				daysOfWeeks.delete(day);
			}
			value.sort((a, b) => a - b);
			return value;
		}),
	);
}
