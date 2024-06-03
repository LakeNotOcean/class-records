import { Type, applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function InsertDataValueDecorator(
	success: string,
	args?: InsertDataValueDecoratorArgs,
) {
	return applyDecorators(
		ApiResponse({
			status: 201,
			description: success,
			type: args?.responseBody,
			isArray: args?.isArray ?? false,
		}),
	);
}

export type InsertDataValueDecoratorArgs = {
	// eslint-disable-next-line @typescript-eslint/ban-types
	responseBody?: string | Function | Type<unknown> | [Function];
	unprocessableEntity?: string;
	isArray?: boolean;
};
