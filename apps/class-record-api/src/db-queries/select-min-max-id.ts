import { EntityManager, EntityTarget } from 'typeorm';

export async function selectIdsForRange<T>(
	entityManager: EntityManager,
	entity: EntityTarget<T>,
	idField: string,
	limit: number,
	offset: number,
): Promise<[number, number]> {
	const entities = await entityManager
		.createQueryBuilder()
		.select(`e.${idField}`)
		.from(entity, 'e')
		.offset(offset)
		.limit(limit)
		.orderBy(`e.${idField}`)
		.getMany();
	const start = entities[0] ? entities[0][idField] : 0;
	const end = entities[entities.length - 1]
		? entities[entities.length - 1][idField]
		: 0;
	return [start, end];
}
