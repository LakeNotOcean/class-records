import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function GetFromDbDecorator(
	// eslint-disable-next-line @typescript-eslint/ban-types
	resultType: string | Function | Type<unknown> | [Function],
	isArray = false,
	success = 'data received successfully',
) {
	return applyDecorators(
		ApiResponse({
			status: 200,
			description: success,
			type: resultType,
			isArray: isArray,
		}),
	);
}
