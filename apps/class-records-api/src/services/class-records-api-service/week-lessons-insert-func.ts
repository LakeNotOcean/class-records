import { addDays, LessonsEntity } from '@common';
import { EntityManager } from 'typeorm';
import { AddLessonsDto } from '../../dto/add-lessons.dto';

export function firstWeekLessonsInsert(
	entityManager: EntityManager,
	dto: AddLessonsDto,
	continuantionConditionFunc: (currDate: Date) => boolean,
): Promise<void>[] {
	const firstDate = dto.firstDate;
	const dayOfFirstDate = firstDate.getDay();
	const weekDays = dto.days;
	const insertPromises: Promise<void>[] = [];

	for (const day of weekDays) {
		if (dayOfFirstDate > day) {
			continue;
		}
		const currDate = addDays(firstDate, day - dayOfFirstDate);
		if (continuantionConditionFunc(currDate)) {
			insertPromises.push(addLessonDbQuery(entityManager, dto, currDate));
		}
	}
	return insertPromises;
}

export function nextWeekLessonsInsert(
	entityManager: EntityManager,
	dto: AddLessonsDto,
	continuantionConditionFunc: (currDate: Date) => boolean,
): Promise<void>[] {
	const firstDate = dto.firstDate;
	const weekDays = dto.days;
	const insertPromises: Promise<void>[] = [];

	let currDate = addDays(firstDate, 7 - firstDate.getDay());

	while (continuantionConditionFunc(currDate)) {
		for (const day of weekDays) {
			currDate = addDays(currDate, currDate.getDay() - day);
			if (!continuantionConditionFunc(currDate)) {
				break;
			}
			insertPromises.push(addLessonDbQuery(entityManager, dto, currDate));
		}
		currDate = addDays(currDate, 7 - currDate.getDay());
	}
	return insertPromises;
}

async function addLessonDbQuery(
	entityManger: EntityManager,
	dto: AddLessonsDto,
	lessonDate: Date,
) {
	const insertLessonResult = await entityManger.insert(LessonsEntity, {
		date: lessonDate,
		title: dto.title,
	});
	const lessonTeachersValues = dto.teachersIds.map((id) => {
		return { lesson_id: insertLessonResult.raw[0].id, teacher_id: id };
	});
	await entityManger
		.createQueryBuilder('lessons_teachers', 'lt')
		.insert()
		.values(lessonTeachersValues)
		.execute();
}
