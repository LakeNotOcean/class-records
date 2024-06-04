import { StatusEnum, toInteger } from '@common';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	Max,
	Min,
	ValidateIf,
} from 'class-validator';

export type intValueDecOptions = {
	isRequired: boolean;
	minValue?: number;
	maxValue?: number;
};

export function intValueDec(opt: intValueDecOptions) {
	const decorators = [
		ApiProperty({ required: opt.isRequired, type: 'integer' }),
		opt.isRequired ? IsNotEmpty() : IsOptional(),
		ValidateIf((_obj, value) => value != null && value != undefined),
		IsInt(),
		Transform(({ value }) =>
			toInteger(value).getStatus() == StatusEnum.Error
				? false
				: parseInt(value),
		),
	];
	if (opt.isRequired) {
		decorators.push(IsInt());
	}
	if (opt.minValue) {
		decorators.push(Min(opt.minValue));
	}
	if (opt.maxValue) {
		decorators.push(Max(opt.maxValue));
	}
	return applyDecorators(...decorators);
}
