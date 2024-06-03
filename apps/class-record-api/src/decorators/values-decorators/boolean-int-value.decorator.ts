import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { isBooleanInt } from '../../validators/boolean-int-value.validator';

export type booleanValueDecOptions = {
	isRequired?: boolean;
	isNumber?: boolean;
};
export function booleanIntValueDec(opt: booleanValueDecOptions) {
	return applyDecorators(
		ApiProperty({
			required: opt.isRequired,
			type: opt.isNumber ? 'integer' : 'string',
			example: opt.isNumber ? 0 : '0',
			description: '1 or 0 - true or false',
		}),
		opt.isRequired ? IsNotEmpty() : IsOptional(),
		isBooleanInt(),
		Transform(({ value }) => {
			if (value === '1') {
				return true;
			}
			if (value === '0') {
				return false;
			}
			return value;
		}),
	);
}
