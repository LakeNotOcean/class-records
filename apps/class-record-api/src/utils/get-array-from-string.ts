import {
	createErrorResult,
	createSuccessResult,
	Result,
	ResultEnum,
} from '@common';

export function getArrayFromString<T>(
	stringValue: string,
	maxValuesInString: number,
	patternForValue: RegExp,
	parseFunction: (s: string) => Result<T>,
): Result<T[]> {
	const regex = new RegExp(
		'/^(' + patternForValue + ')(,' + patternForValue + ')*$',
	);
	if (!regex.test(stringValue)) {
		return createErrorResult('the string does not match the pattern');
	}
	const splitResult = stringValue.split(',');
	if (splitResult.length > maxValuesInString) {
		return createErrorResult('too many values ​​in a string');
	}
	const numberArr: T[] = [];
	for (const s of splitResult) {
		const parseNumb = parseFunction(s);
		if (parseNumb.result == ResultEnum.Error) {
			return createErrorResult('some value is invalid');
		}
		numberArr.push(parseNumb.resultData);
	}
	return createSuccessResult(numberArr);
}
