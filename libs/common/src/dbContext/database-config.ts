import { ConfigService } from '@nestjs/config';
import {
	TypeOrmModuleAsyncOptions,
	TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { generalConfig } from '../configs/config';
import { TypeOrmJsonLogger } from '../loggers';

export function getDatabaseConfig(
	configService?: ConfigService,
): DataSourceOptions {
	configService ??= new ConfigService(generalConfig());

	return {
		type: 'postgres',
		host: configService.getOrThrow<string>('postgresHost'),
		port: configService.getOrThrow<number>('postgresPort'),
		username: configService.getOrThrow<string>('postgresUsername'),
		password: configService.getOrThrow<string>('postgresPassword'),
		database: configService.getOrThrow<string>('postgresDatabase'),
		schema: configService.getOrThrow<string>('postgresSchema'),
		synchronize: false,
		logging: Boolean(configService.getOrThrow<boolean>('postgresIsLogging')),
		// system pool
		extra: {
			max: Number(configService.getOrThrow<number>('postgresClientPool')),
			idleTimeoutMillis: 30000,
		},
		logger: new TypeOrmJsonLogger(),
		maxQueryExecutionTime: 1000,
		migrations: [join(__dirname, 'migrations', '*{.js,.ts}')],
		entities: [join(__dirname, 'entities', '*{.js,.ts}')],
	};
}

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
	useFactory: async (
		configService?: ConfigService,
	): Promise<TypeOrmModuleOptions> => {
		return getDatabaseConfig(configService);
	},
};

export default new DataSource(getDatabaseConfig());
