import { getRandomInt } from './get-random-int';
import { shuffleArray } from './shuffle-array';

export function getRandomElementsFromArray<T>(
	arr: T[],
	maxNumberOfElements?: number,
): T[] {
	const shuffledArray = [...arr];
	shuffleArray(shuffledArray);
	const len = shuffleArray.length;

	const numberOfSelectedElements = getRandomInt(
		maxNumberOfElements && len > maxNumberOfElements
			? maxNumberOfElements + 1
			: len + 1,
	);

	const selectedElements: T[] = [];

	for (let j = 0; j < numberOfSelectedElements; ++j) {
		selectedElements.push(shuffledArray.pop());
	}

	return selectedElements;
}
