export function getRandomInt(minInteger: number, maxInteger: number) {
	return minInteger + Math.floor(Math.random() * (maxInteger - minInteger + 1));
}
