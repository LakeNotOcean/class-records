import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export type booleanDecOptions = {
	isRequired: boolean;
};
export function booleanDec(opt: booleanDecOptions) {
	return applyDecorators(
		ApiProperty({ required: opt.isRequired, type: Boolean }),
		opt.isRequired ? IsNotEmpty() : IsOptional(),
		IsBoolean(),
		Transform(({ value }) =>
			typeof value === 'boolean' ? value : value === 'true',
		),
	);
}
