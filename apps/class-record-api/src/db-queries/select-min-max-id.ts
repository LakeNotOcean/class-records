import { LessonsEntity } from '@common';
import { EntityManager } from 'typeorm';

export async function selectIdsForRange(
	entityManager: EntityManager,
	limit: number,
	offset: number,
): Promise<[number, number]> {
	const lessons = await entityManager
		.createQueryBuilder()
		.select('l.id')
		.from(LessonsEntity, 'l')
		.offset(offset)
		.limit(limit)
		.orderBy('l.id')
		.getMany();
	const start = lessons[0] ? lessons[0].id : 0;
	const end = lessons[lessons.length - 1] ? lessons[lessons.length - 1].id : 0;
	return [start, end];
}
