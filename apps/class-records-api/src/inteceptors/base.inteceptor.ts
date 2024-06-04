import {
	CallHandler,
	ExecutionContext,
	HttpException,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import {
	DbException,
	Exception,
	InternalException,
} from 'libs/common/src/exceptions';
import { Observable, catchError } from 'rxjs';

@Injectable()
export class BaseInterceptor implements NestInterceptor {
	async intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Promise<Observable<unknown>> {
		return next.handle().pipe(
			catchError(async (error) => {
				if (error instanceof Exception || error instanceof HttpException) {
					throw error;
				}
				if (error?.code && isNaN(+error.code)) {
					throw new DbException(error);
				}
				throw new InternalException(error);
			}),
		);
	}
}
