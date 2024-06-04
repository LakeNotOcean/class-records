export function getKey(...args: number[]): string {
	return args.join('_');
}
