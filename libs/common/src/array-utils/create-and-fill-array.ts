export function createAndFillArray<T>(
	size: number,
	generationFunction: () => T,
): T[] {
	const arr = new Array(size);
	for (let i = 0; i < size; i++) {
		arr[i] = generationFunction();
	}
	return arr;
}
