import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { isBooleanInt } from '../validators/boolean-int-value.validator';

export type booleanValueDecOptions = {
	isRequired?: boolean;
};
export function booleanIntValueDec(opt: booleanValueDecOptions) {
	return applyDecorators(
		ApiProperty({
			required: opt.isRequired,
			type: 'string',
			example: '0',
			description: '1 or 0 - true or false',
		}),
		opt.isRequired ? IsNotEmpty() : IsOptional(),
		IsInt(),
		isBooleanInt(),
		Transform(({ value }) => {
			if (value === '0') {
				return false;
			} else return true;
		}),
	);
}
