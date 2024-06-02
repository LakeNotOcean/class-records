import { ServerException } from './core/exceptions';

export class DbException extends ServerException {
	constructor(dbError: any) {
		super(dbError?.code, dbError?.message, createNewDbError(dbError), dbError);
	}
}

export const createNewDbError = (error: any) => {
	return {
		message: 'the database request was incorrect',
		errorDetail: error?.detail,
		innterDb: error?.inner,
	};
};
