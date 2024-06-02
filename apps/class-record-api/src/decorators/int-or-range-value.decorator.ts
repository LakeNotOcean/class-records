import { ResultEnum } from '@common';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, ValidateIf, ValidationError } from 'class-validator';
import { getRangeFromString, RangeDto } from '../dto/range.dto';
import { intValueDecoratorOptions } from './int-value.decorator';

export function IntOrRangeValueDec(opt: intValueDecoratorOptions) {
	return applyDecorators(
		ApiProperty({
			type: Object,
			oneOf: [{ $ref: getSchemaPath(RangeDto) }, { type: 'integer' }],
			required: opt.isRequired,
		}),
		opt.isRequired ? IsNotEmpty() : IsOptional(),
		ValidateIf((_obj, value) => value != null && value != undefined),

		Type(({ object, property }) => {
			const propertyObject = object[property];
            const error=new ValidationError();
			(typeof propertyObject !== 'string') {
                throw 
			}
			const rangeFromString = getRangeFromString(propertyObject);
			if (rangeFromString.result == ResultEnum.Success) {
				return rangeFromString.resultData;
			}
			const error = new ValidationError();
			error.property = property;
			throw new ValidationException([error]);
		}),
	);
}
