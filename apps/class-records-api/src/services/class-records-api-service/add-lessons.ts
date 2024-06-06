import { toYYYYMMDD } from '@common';
import { EntityManager } from 'typeorm';
import { AddLessonsDto } from '../../dto/add-lessons.dto';
import { CheckService } from '../check-service/check.service';
import {
	firstWeekLessonsInsert,
	nextWeekLessonsInsert,
} from './week-lessons-insert-func';

// функция для добавления списка занятий
export async function addLessonsToDb(
	entityManager: EntityManager,
	checkService: CheckService,
	dto: AddLessonsDto,
): Promise<void> {
	// предварительная проверка для наличие учителей с указанными id
	await checkService.checkIfTeachersExists(entityManager, dto.teachersIds);
	const insertPromises: Promise<void>[] = [];

	// в зависимости от поля, по которому завершается генерация занятий, выбирается соответствуюшая функция для проверки условий
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

	// добавление данных для первой недели
	// алгоритм немного отличается, поэтому вынесен в отдельную функцию
	insertPromises.push(
		...firstWeekLessonsInsert(entityManager, dto, continuantionConditionFunc),
	);
	// добавление данных для последующих недель
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
