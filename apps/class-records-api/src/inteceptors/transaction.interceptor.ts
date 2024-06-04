import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, finalize, tap } from 'rxjs';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
	constructor(private readonly dataSource: DataSource) {}
	async intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Promise<Observable<unknown>> {
		const req = context.switchToHttp().getRequest();
		const queryRunner: QueryRunner = await this.dbInit();

		req.queryRunnerManager = queryRunner.manager;

		return next.handle().pipe(
			catchError(async (error) => {
				if (queryRunner.isTransactionActive) {
					await queryRunner.rollbackTransaction();
				}
				if (!queryRunner.isReleased) {
					await queryRunner.release();
				}
				throw error;
			}),
			tap(async () => {
				if (queryRunner.isTransactionActive) {
					await queryRunner.rollbackTransaction();
				}
				if (!queryRunner.isReleased) {
					await queryRunner.release();
				}
			}),
			finalize(async () => {
				if (queryRunner.isTransactionActive) {
					await queryRunner.rollbackTransaction();
				}
				if (!queryRunner.isReleased) {
					await queryRunner.release();
				}
			}),
		);
	}

	private async dbInit(): Promise<QueryRunner> {
		const queryRunner = this.dataSource.createQueryRunner();

		return queryRunner;
	}
}
