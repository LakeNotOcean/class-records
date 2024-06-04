import {
	createErrorResult,
	createSuccessResult,
	Result,
	StatusEnum,
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
		if (parseNumb.getStatus() == StatusEnum.Error) {
			return createErrorResult('some value is invalid');
		}
		numberArr.push(parseNumb.unwrap());
	}
	return createSuccessResult(numberArr);
}
