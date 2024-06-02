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

export type intValueDecoratorOptions = {
	isRequired: boolean;
	minValue?: number;
	maxValue?: number;
};

export function IntValueDecorator(opt: intValueDecoratorOptions) {
	const decorators = [
		ApiProperty({ required: opt.isRequired, type: 'integer' }),
		opt.isRequired ? IsNotEmpty() : IsOptional(),
		ValidateIf((_obj, value) => value != null && value != undefined),
		Transform(({ value }) => (value ? parseInt(value) : value)),
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
