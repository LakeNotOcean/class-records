import { isNullOrUndefined } from '@common';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	ValidateIf,
} from 'class-validator';

export type stringValueDecOptions = {
	isRequired: boolean;
	maxLength?: number;
};

export function stringValueDec(opt: stringValueDecOptions) {
	const decorators = [
		opt.isRequired ? IsNotEmpty() : IsOptional(),
		ValidateIf((_obj, value) => !(!opt.isRequired && isNullOrUndefined(value))),
		IsString(),
		ApiProperty({ required: true, example: 'Name' }),
	];
	if (opt.maxLength) {
		decorators.push(MaxLength(opt.maxLength));
	}
	return applyDecorators(...decorators);
}
