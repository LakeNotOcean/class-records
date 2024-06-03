import { StatusEnum } from './Status.enum';

export type ResultArgs<T> = {
	status: StatusEnum;
	errorMessage?: string;
	resultData?: T;
};
export class Result<T> {
	private readonly status: StatusEnum;
	private readonly errorMessage?: string;
	private readonly resultData?: T;

	constructor(args: ResultArgs<T>) {
		this.status = args.status;
		if (args.status == StatusEnum.Success) {
			this.resultData = args.resultData;
		}
		this.errorMessage = args.errorMessage;
	}
	unwrap(): T {
		if (this.status != StatusEnum.Success) {
			throw new Error('the operation status was unsuccessful');
		}
		return this.resultData;
	}
	getStatus(): StatusEnum {
		return this.status;
	}
	getErrorMessage(): string {
		return this.errorMessage;
	}
}

export function createEmptyResult(): Result<void> {
	return new Result({ status: StatusEnum.Success });
}

export function createSuccessResult<T>(resultData: T): Result<T> {
	return new Result({ status: StatusEnum.Success, resultData });
}

export function createErrorResult<T>(errorMessage?: string): Result<T> {
	return new Result<T>({ status: StatusEnum.Error, errorMessage });
}
