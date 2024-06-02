import { ExceptionTypeEnum } from './exception.enum';

export type ExceptionPayload = {
	message: string;
	[key: string]: any;
};
export abstract class Exception {
	abstract type: ExceptionTypeEnum;
	constructor(
		readonly code?: number,
		readonly description?: string,
		readonly payload?: ExceptionPayload,
		readonly inner?: unknown,
	) {}
}

export abstract class AuthenticationException extends Exception {
	public readonly type = ExceptionTypeEnum.Authentication;
}

export abstract class AuthorisationException extends Exception {
	public readonly type = ExceptionTypeEnum.Authorization;
}

export abstract class NotAllowedException extends Exception {
	public readonly type = ExceptionTypeEnum.Authorization;
}

export abstract class NotFoundException extends Exception {
	public readonly type = ExceptionTypeEnum.NotFound;
}

export abstract class ClientException extends Exception {
	public readonly type = ExceptionTypeEnum.Client;
}

export abstract class ServerException extends Exception {
	public readonly type = ExceptionTypeEnum.Server;
}

export abstract class BusinessException extends Exception {
	public readonly type = ExceptionTypeEnum.BusinessException;
}

export abstract class ExternalException extends Exception {
	public readonly type = ExceptionTypeEnum.ExternalException;
}
