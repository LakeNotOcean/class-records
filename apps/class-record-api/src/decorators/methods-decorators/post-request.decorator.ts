import { Post, UseInterceptors, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { TransactionInterceptor } from '../../inteceptors/transaction.interceptor';
import {
	InsertDataValueDecorator,
	InsertDataValueDecoratorArgs,
} from './actions/insert-data.decorator';

export type postRequestDecOptions = {
	route?: string;
	description?: string;
	responseString: string;
	responseArgs?: InsertDataValueDecoratorArgs;
	isResultArray?: boolean;
	isTransaction?: boolean;
};

// required if due to dependency bug
export function PostRequestDec(options: postRequestDecOptions) {
	if (options.isTransaction) {
		return applyDecorators(
			Post(options.route),
			ApiOperation({ description: options.description ?? '' }),
			InsertDataValueDecorator(options.responseString, options.responseArgs),
			UseInterceptors(TransactionInterceptor),
		);
	}
	return applyDecorators(
		Post(options.route),
		ApiOperation({ description: options.description ?? '' }),
		InsertDataValueDecorator(options.responseString, options.responseArgs),
	);
}
