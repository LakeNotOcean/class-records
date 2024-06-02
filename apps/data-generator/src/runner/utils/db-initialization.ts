import { JsonLogger } from '@common';
import { DataSource, QueryRunner } from 'typeorm';

export async function dbInitialization(
	dataSource: DataSource,
	logger: JsonLogger,
): Promise<QueryRunner> {
	logger.log('connection to database...');
	await dataSource.initialize();
	const queryRunner = dataSource.createQueryRunner();
	await queryRunner.connect();
	logger.log('connected');
	return queryRunner;
}
