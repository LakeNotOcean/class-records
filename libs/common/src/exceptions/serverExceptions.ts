import { ServerException } from './core/exceptions';

export class AxiosException extends ServerException {
	constructor(error: any) {
		super(error?.code, 'axios error', error);
	}
}

export class InternalException extends ServerException {
	constructor(error: any) {
		super(
			error?.code,
			'internal exception',
			{
				message: 'unhandled exception',
				messageFromException: error?.message,
				exceptionDetail: error?.detail,
			},
			error,
		);
	}
}
