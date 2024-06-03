import { EntityManager, EntityTarget } from 'typeorm';

export async function selectIdsForRange<T>(
	entityManager: EntityManager,
	entity: EntityTarget<T>,
	idField: string,
	limit: number,
	offset: number,
): Promise<number[]> {
	const queryResult = await entityManager
		.createQueryBuilder()
		.select(`MIN(e.${idField})`, 'min')
		.from(entity, 'e')
		.getRawOne();
	const minId = parseInt(queryResult.min) || 0;
	const startId = minId + offset;
	const endId = startId + limit - 1;
	return [startId, endId];
}
