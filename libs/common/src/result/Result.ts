import { ResultEnum } from './Result.enum';

export class Result<T> {
	readonly result: ResultEnum;
	readonly resultData?: T;
	constructor(result: ResultEnum, resultData?: T) {
		this.result = result;
		this.resultData = resultData;
	}
}

export function createEmptyResult(): Result<void> {
	return { result: ResultEnum.Success };
}

export function createSuccessResult<T>(data: T): Result<T> {
	return new Result(ResultEnum.Success, data);
}

export function createErrorResult<T>(): Result<T> {
	return new Result<T>(ResultEnum.Error);
}
