import { ConfigService } from '@nestjs/config';
import {
	TypeOrmModuleAsyncOptions,
	TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import { TypeOrmJsonLogger } from '../loggers';
import {
	LessonsEntity,
	LessonStudentsEntity,
	StudentsEntity,
	TeachersEntity,
} from './entities';

export function getDatabaseConfig(
	configService: ConfigService,
): DataSourceOptions {
	const isLogging = configService.getOrThrow('postgresIsLogging') === 'true';
	return {
		type: 'postgres',
		host: configService.getOrThrow<string>('postgresHost'),
		port: configService.getOrThrow<number>('postgresPort'),
		username: configService.getOrThrow<string>('postgresUsername'),
		password: configService.getOrThrow<string>('postgresPassword'),
		database: configService.getOrThrow<string>('postgresDatabase'),
		schema: configService.getOrThrow<string>('postgresSchema'),
		synchronize: false,
		logging: isLogging,
		// system pool
		extra: {
			max: Number(configService.getOrThrow<number>('postgresClientPool')),
			idleTimeoutMillis: 30000,
		},
		logger: new TypeOrmJsonLogger(),
		maxQueryExecutionTime: 1000,
		migrations: [join(__dirname, 'migrations', '*{.js,.ts}')],
		entities: [
			LessonsEntity,
			LessonStudentsEntity,
			StudentsEntity,
			TeachersEntity,
		],
	};
}

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
	useFactory: async (
		configService?: ConfigService,
	): Promise<TypeOrmModuleOptions> => {
		return getDatabaseConfig(configService);
	},
};
