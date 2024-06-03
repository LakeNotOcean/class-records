import { Get, Type, UseInterceptors, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { TransactionInterceptor } from '../../inteceptors/transaction.interceptor';
import { GetFromDbDecorator } from './get-from-db.decorator';

export type getRequestDecOptions = {
	route?: string;
	description?: string;
	// eslint-disable-next-line @typescript-eslint/ban-types
	resultType: string | Function | Type<unknown> | [Function];
	isResultArray?: boolean;
	isTransaction?: boolean;
};

// required if due to dependency bug
export function GetRequestDec(options: getRequestDecOptions) {
	if (options.isTransaction) {
		return applyDecorators(
			Get(options.route),
			ApiOperation({ description: options.description ?? '' }),
			GetFromDbDecorator(options.resultType, options.isResultArray ?? false),
			UseInterceptors(TransactionInterceptor),
		);
	}
	return applyDecorators(
		Get(options.route),
		ApiOperation({ description: options.description ?? '' }),
		GetFromDbDecorator(options.resultType, options.isResultArray ?? false),
	);
}
