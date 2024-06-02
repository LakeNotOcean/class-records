import { ConsoleLogger } from '@nestjs/common';
import { LogMessageEnum } from './enums/logger-message.enum';

export class JsonLogger extends ConsoleLogger {
	private _loggerMessageType = LogMessageEnum.customMessage;
	constructor(context: string) {
		super(context);
	}
	get logMessageType(): LogMessageEnum {
		return this._loggerMessageType;
	}
	set logMessageType(logMessage: LogMessageEnum) {
		this._loggerMessageType = logMessage;
	}
	log(logData: string | object, loggerMessageType?: LogMessageEnum) {
		if (typeof logData == 'string') {
			logData = { message: logData };
		}
		super.log({
			type: loggerMessageType ? loggerMessageType : this._loggerMessageType,
			logData,
		});
	}
	warn(logData: string | object, loggerMessageType?: LogMessageEnum) {
		if (typeof logData == 'string') {
			logData = { message: logData };
		}
		super.warn({
			type: loggerMessageType ? loggerMessageType : this._loggerMessageType,
			logData,
		});
	}
	error(logData: string | object, loggerMessageType?: LogMessageEnum) {
		if (typeof logData == 'string') {
			logData = { message: logData };
		}
		super.error({
			type: loggerMessageType ? loggerMessageType : this._loggerMessageType,
			logData: {
				message: logData['message'],
				stack: logData['stack'],
				...logData,
			},
		});
	}
}
