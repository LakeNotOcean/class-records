import { EnvEnum } from 'lib/enums/env.enum';
import { QueryRunner, Logger as TypeOrmLogger } from 'typeorm';
import { SqlQueryLogger } from './sql-query-json.logger';

type logDataFormatFuncType = (query: string) => object;

export class TypeOrmJsonLogger implements TypeOrmLogger {
	private readonly logger = new SqlQueryLogger();

	private logDataFormatFunc: logDataFormatFuncType;
	constructor() {
		const nodeEnv = process.env.NODE_ENV;
		if (nodeEnv && nodeEnv == EnvEnum.dev) {
			this.logDataFormatFunc = logQueryFormatDebugFunc;
		} else {
			this.logDataFormatFunc = logQueryFormatFunc;
		}
	}

	logQuery(query: string, parameters: Array<any>, _queryRunner?: QueryRunner) {
		this.logger.log(this.logDataFormatFunc(query), parameters);
	}

	logQueryError(
		error: string,
		query: string,
		parameters: Array<any>,
		_queryRunner?: QueryRunner,
	) {
		this.logger.error(this.logDataFormatFunc(query), parameters, error);
	}

	logQuerySlow(
		time: number,
		query: string,
		parameters: Array<any>,
		_queryRunner?: QueryRunner,
	) {
		this.logger.warn(this.logDataFormatFunc(query), parameters, time);
	}

	logSchemaBuild(message: string, _queryRunner?: QueryRunner) {
		this.logger.debug(message);
	}

	logMigration(message: string, _queryRunner?: QueryRunner) {
		this.logger.debug(message);
	}

	log(
		level: 'log' | 'info' | 'warn',
		message: any,
		_queryRunner?: QueryRunner,
	) {
		switch (level) {
			case 'log':
			case 'info':
				this.logger.logMessage(message);
				break;
			case 'warn':
				this.logger.warnMessage(message);
				break;
		}
	}
}

function logQueryFormatDebugFunc(query: string) {
	return { query: normalizeQuery(query) };
}
function logQueryFormatFunc(query: string) {
	const entity = query.match(/(?<=from|join)(\s+\w+\b)/)?.[0];
	const operation = query.match(
		/(INSERT INTO|UPDATE|SELECT|WITH|DELETE)/i,
	)?.[0];
	if (!entity || !operation) {
		return { query: normalizeQuery(query.substring(0, 50) + '...') };
	}
	return {
		sqlOperation: operation,
		entity: entity,
	};
}

function normalizeQuery(query: string) {
	return query.replace(/\s\s+/g, ' ').trim();
}
