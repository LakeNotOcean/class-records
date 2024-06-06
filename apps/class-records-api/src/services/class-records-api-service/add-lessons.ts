import { toYYYYMMDD } from '@common';
import { EntityManager } from 'typeorm';
import { AddLessonsDto } from '../../dto/add-lessons.dto';
import { CheckService } from '../check-service/check.service';
import {
	firstWeekLessonsInsert,
	nextWeekLessonsInsert,
} from './week-lessons-insert-func';

export async function addLessonsToDb(
	entityManager: EntityManager,
	checkService: CheckService,
	dto: AddLessonsDto,
): Promise<void> {
	await checkService.checkIfTeachersExists(entityManager, dto.teachersIds);
	const insertPromises: Promise<void>[] = [];

	let continuantionConditionFunc: (
		currDate: Date,
		changeCount: boolean,
	) => boolean;
	let lessonsCount = dto.lessonsCount;

	if (dto.lastDate) {
		const lastDateYYYYMMDD = toYYYYMMDD(dto.lastDate).unwrap();
		continuantionConditionFunc = (currDate: Date) => {
			return toYYYYMMDD(currDate).unwrap() <= lastDateYYYYMMDD;
		};
	} else {
		continuantionConditionFunc = (
			_currDate: Date,
			changeCount: boolean,
		): boolean => {
			if (changeCount) {
				--lessonsCount;
				return lessonsCount + 1 > 0;
			}
			return lessonsCount > 0;
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
