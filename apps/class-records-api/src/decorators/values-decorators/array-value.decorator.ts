import { applyDecorators } from '@nestjs/common';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	ArrayMaxSize,
	IsArray,
	IsNotEmpty,
	IsOptional,
	ValidateIf,
	ValidateNested,
} from 'class-validator';

/* eslint-disable @typescript-eslint/ban-types */
export type arrayValueDecOptions = {
	targetEntity: NonNullable<Function>;
	type?: string;
	isRequired: boolean;
	maxSize?: number;
	examples?: unknown[];
};

export function arrayValueDec(opt: arrayValueDecOptions) {
	const decorators = [
		ApiProperty({
			type: 'array',
			required: opt.isRequired,
			examples: opt.examples,
			items: opt.targetEntity
				? { $ref: getSchemaPath(opt.targetEntity) }
				: { type: opt.type ? opt.type : 'string' },
		}),
		opt.isRequired ? IsNotEmpty() : IsOptional(),
	];
	if (!opt.isRequired) {
		decorators.push(
			ValidateIf((_, value) => value != null && value != undefined),
		);
	}
	decorators.push(
		IsArray(),
		ValidateNested({ each: true }),
		Type(() => opt.targetEntity),
	);
	if (opt.maxSize) {
		decorators.push(ArrayMaxSize(opt.maxSize));
	}
	return applyDecorators(...decorators);
}
