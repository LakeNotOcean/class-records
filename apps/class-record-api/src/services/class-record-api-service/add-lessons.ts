import { toYYYYMMDD } from '@common';
import { EntityManager } from 'typeorm';
import { AddLessonsDto } from '../../dto/add-lessons.dto';
import { CheckService } from '../check-service/check.service';
import {
	firstWeekLessonsInsert,
	nextWeekLessonsInsert,
} from './week-lessons-insert-func';

export async function addLessons(
	entityManager: EntityManager,
	checkService: CheckService,
	dto: AddLessonsDto,
): Promise<void> {
	await checkService.checkIfTeachersExists(entityManager, dto.teachersIds);
	const insertPromises: Promise<void>[] = [];

	let continuantionConditionFunc: (currDate: Date) => boolean;
	let lessonsCount = dto.lessonsCount;
	if (dto.lastDate) {
		const lastDateYYYYMMDD = toYYYYMMDD(dto.lastDate).unwrap();
		continuantionConditionFunc = (currDate: Date) => {
			return toYYYYMMDD(currDate).unwrap() <= lastDateYYYYMMDD;
		};
	} else {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		continuantionConditionFunc = (currDate: Date) => {
			return Boolean(lessonsCount--);
		};
	}

	insertPromises.push(
		...firstWeekLessonsInsert(entityManager, dto, continuantionConditionFunc),
	);
	insertPromises.push(
		...nextWeekLessonsInsert(entityManager, dto, continuantionConditionFunc),
	);

	const promiseResults = await Promise.allSettled(insertPromises);
	promiseResults.forEach((r) => {
		if (r.status == 'rejected') {
			throw new Error(r.reason);
		}
	});
}
