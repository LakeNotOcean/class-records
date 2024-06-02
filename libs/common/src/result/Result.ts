import { ResultEnum } from './Result.enum';

export class Result<T> {
	readonly result: ResultEnum;
	readonly errorMessage?: string;
	readonly resultData?: T;
	constructor(args: Partial<Result<T>> & Pick<Result<T>, 'result'>) {
		this.result = args.result;
		this.resultData = args.resultData;
		this.errorMessage = args.errorMessage;
	}
}

export function createEmptyResult(): Result<void> {
	return new Result({ result: ResultEnum.Success });
}

export function createSuccessResult<T>(resultData: T): Result<T> {
	return new Result({ result: ResultEnum.Success, resultData });
}

export function createErrorResult<T>(errorMessage?: string): Result<T> {
	return new Result<T>({ result: ResultEnum.Error, errorMessage });
}
