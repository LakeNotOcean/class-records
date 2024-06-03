import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export type stringValueDecOptions = {
	isRequired?: boolean;
};

export function stringValueDec(opt: stringValueDecOptions) {
	return applyDecorators(
		opt.isRequired ? IsNotEmpty() : IsOptional(),
		ValidateIf((_obj, value) => value != null && value != undefined),
		IsString(),
		ApiProperty({ required: true, example: 'Name' }),
	);
}
