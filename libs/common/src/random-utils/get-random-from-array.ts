import { getRandomInt } from './get-random-int';
import { shuffleArray } from './shuffle-array';

export function getRandomElementsFromArray<T>(
	arr: T[],
	maxNumberOfElements?: number,
	shuffledArr?: T[],
): T[] {
	if (!shuffledArr || shuffledArr.length == 0) {
		shuffledArr = [...arr];
		shuffleArray(shuffledArr);
	}
	const len = shuffledArr.length;

	const numberOfSelectedElements = getRandomInt(
		1,
		maxNumberOfElements && len > maxNumberOfElements
			? maxNumberOfElements
			: len,
	);

	const selectedElements: T[] = [];

	for (let j = 0; j < numberOfSelectedElements; ++j) {
		selectedElements.push(shuffledArr.pop());
	}

	return selectedElements;
}
