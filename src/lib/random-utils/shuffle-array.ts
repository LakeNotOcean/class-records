export function shuffleArray<T>(arr: T[]): void {
	let currentIndex = arr.length;

	while (currentIndex != 0) {
		const randomIndex = Math.floor(Math.random() * currentIndex);
		--currentIndex;

		[arr[currentIndex], arr[randomIndex]] = [
			arr[randomIndex],
			arr[currentIndex],
		];
	}
}
