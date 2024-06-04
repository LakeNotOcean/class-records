import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsOptional } from 'class-validator';

export type dateValueDecOptions = {
	isRequired?: boolean;
};
export function dateValueDec(opt: dateValueDecOptions) {
	return applyDecorators(
		ApiProperty({ required: opt.isRequired, type: Date }),
		opt.isRequired ? IsDateString() : IsOptional(),
		Transform(({ value }) => {
			if (!value) {
				return null;
			}
			return new Date(value) || new Date(parseInt(value));
		}),
	);
}
