import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { getConfigFromPath } from '../configs';

// Отдельная конфигурация соединения для миграций БД
// При компиляции Webpack'ом ломается структура приложения и возникает проблема при конфигурации сущностей
function getDatabaseConfig(configService: ConfigService): DataSourceOptions {
	return {
		type: 'postgres',
		host: configService.getOrThrow<string>('postgresHost'),
		port: configService.getOrThrow<number>('postgresPort'),
		username: configService.getOrThrow<string>('postgresUsername'),
		password: configService.getOrThrow<string>('postgresPassword'),
		database: configService.getOrThrow<string>('postgresDatabase'),
		schema: configService.getOrThrow<string>('postgresSchema'),
		synchronize: false,
		logging: true,
		logger: 'simple-console',
		maxQueryExecutionTime: 1000,
		migrations: [join(__dirname, 'migrations', '*{.js,.ts}')],
		entities: [
			join(__dirname, 'entities', '*{.js,.ts}'),
			join(__dirname, 'views', '*{.js,.ts}'),
		],
	};
}

export default new DataSource(
	getDatabaseConfig(
		new ConfigService(
			getConfigFromPath(join(__dirname, '..', '..', '..', '..', 'env')),
		),
	),
);
