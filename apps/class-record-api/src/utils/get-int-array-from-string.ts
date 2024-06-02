import {
	createErrorResult,
	createSuccessResult,
	Result,
	ResultEnum,
	toInteger,
} from '@common';

export function getIntArrayFromString(
	stringValue: string,
	maxIntInString: number,
): Result<number[]> {
	if (!/^[1-9]([0-9]+)(,[1-9]([0-9]+))*$/.test(stringValue)) {
		return createErrorResult('the string does not match the pattern');
	}
	const splitResult = stringValue.split(',');
	if (splitResult.length > maxIntInString) {
		return createErrorResult('too many values ​​in a string');
	}
	const numberArr: number[] = [];
	for (const s of splitResult) {
		const parseNumb = toInteger(s);
		if (parseNumb.result == ResultEnum.Error) {
			return createErrorResult('some value is invalid');
		}
		numberArr.push(parseNumb.resultData);
	}
	return createSuccessResult(numberArr);
}
