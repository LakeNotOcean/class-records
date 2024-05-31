import { JsonLogger } from './base-json.logger';
import { LogMessageEnum } from './enums/logger-message.enum';

export class SqlQueryLogger {
	private readonly logger = new JsonLogger('SQL');
	constructor() {
		this.logger.logMessageType = LogMessageEnum.sqlQuery;
	}
	log(queryData: object, parameters: unknown[]) {
		this.logger.log({
			queryData: queryData,
			parameters,
			message: 'sql query',
		});
	}
	logMessage(message: string) {
		this.logger.log(message);
	}
	warnMessage(message: string) {
		this.logger.warn(message);
	}
	warn(queryData: object, parameters: unknown[], time: number) {
		this.logger.warn({
			queryData: queryData,
			parameters,
			time,
			message: 'slow sql query',
		});
	}
	debug(message: string) {
		this.logger.debug(message);
	}
	error(queryData: object, parameters: unknown[], error: string) {
		this.logger.error({
			queryData: queryData,
			parameters,
			error,
			message: 'failed sql query',
		});
	}
}
