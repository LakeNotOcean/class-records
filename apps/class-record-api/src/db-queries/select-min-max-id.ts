import { SelectQueryBuilder } from 'typeorm';

export async function selectIdsForRange<T>(
	build: SelectQueryBuilder<T>,
	idField: string,
	limit: number,
	offset: number,
): Promise<number[]> {
	const queryResult = await build
		.addSelect(`MIN(${idField})`, 'min')
		.getRawOne();
	const minId = parseInt(queryResult.min) || 0;
	const startId = minId + offset;
	const endId = startId + limit - 1;
	return [startId, endId];
}
