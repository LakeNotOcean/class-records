import { applyDecorators } from '@nestjs/common';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsNotEmpty,
	IsOptional,
	ValidateIf,
	ValidateNested,
} from 'class-validator';

/* eslint-disable @typescript-eslint/ban-types */
export type arrayValueDecOptions = {
	targetEntity: NonNullable<Function>;
	isRequired: boolean;
};

export function arrayValueDec(opt: arrayValueDecOptions) {
	const decorators = [
		ApiProperty({
			type: 'array',
			required: opt.isRequired,
			items: { $ref: getSchemaPath(opt.targetEntity) },
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
	return applyDecorators(...decorators);
}
