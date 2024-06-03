import {
	createAndFillArray,
	getRandomDate,
	getRandomElementsFromArray,
	LessonsEntity,
	LessonStudentsEntity,
	MAX_BULK,
	StudentsEntity,
	TeachersEntity,
} from '@common';
import { faker } from '@faker-js/faker';
import { InsertResult, QueryRunner } from 'typeorm';

export async function lessonsTableGeneration(
	queryRunner: QueryRunner,
	quantity: number,
) {
	await queryRunner.startTransaction();
	const manager = queryRunner.manager;

	const teachersIds = (
		await manager.find(TeachersEntity, {
			select: ['id'],
		})
	).map((t) => t.id);
	if (teachersIds.length == 0) {
		throw new Error('at least one teacher must be in the database');
	}

	const studentsIds = (
		await manager.find(StudentsEntity, { select: ['id'] })
	).map((t) => t.id);

	const promises: Promise<InsertResult>[] = [];

	const minDate = new Date();
	minDate.setFullYear(new Date().getFullYear() - 2);
	const maxDate = new Date();
	maxDate.setFullYear(new Date().getFullYear() + 2);

	for (let i = 0; i < quantity; i += MAX_BULK) {
		const data = createAndFillArray(
			quantity > MAX_BULK ? MAX_BULK : quantity,
			() => {
				return {
					date: getRandomDate(minDate, maxDate),
					status: Math.random() < 0.8 ? true : false,
					title: faker.music.songName(),
				};
			},
		);
		promises.push(
			manager
				.createQueryBuilder()
				.insert()
				.into(LessonsEntity)
				.values(data)
				.returning(['id'])
				.execute(),
		);
	}

	const promiseResults = await Promise.allSettled(promises);
	const insertResults = promiseResults.map((r) => {
		if (r.status == 'rejected') {
			throw new Error(r.reason);
		}
		return r.value;
	});

	for await (const insertResult of insertResults) {
		const rawInsertResult = insertResult.raw;
		const shuffledTeachersIds: number[] = [];
		const shuffledStudentsIds: number[] = [];

		for (let i = 0; i < rawInsertResult.length; i += MAX_BULK) {
			for await (const raw of rawInsertResult) {
				const selectedTeachersIds = getRandomElementsFromArray(
					teachersIds,
					3,
					shuffledTeachersIds,
				);
				const selectedStudentsIds = getRandomElementsFromArray(
					studentsIds,
					60,
					shuffledStudentsIds,
				);

				const lessonId = raw.id as number;
				const bulkInsertTeachersData: object[] = [];
				const bulkInsertStudentsData: object[] = [];
				for await (const teacherId of selectedTeachersIds) {
					bulkInsertTeachersData.push({
						lesson_id: lessonId,
						teacher_id: teacherId,
					});
					await manager
						.createQueryBuilder('lesson_teachers', 'lt')
						.insert()
						.values({ lesson_id: lessonId, teacher_id: teacherId })
						.execute();
				}
				for await (const studentId of selectedStudentsIds) {
					bulkInsertStudentsData.push({
						lessonId: lessonId,
						studentId: studentId,
						visit: Math.random() < 0.8 ? true : false,
					});
					await manager
						.createQueryBuilder()
						.insert()
						.into(LessonStudentsEntity)
						.values({
							lessonId: lessonId,
							studentId: studentId,
							visit: Math.random() < 0.8 ? true : false,
						})
						.execute();
				}
			}
		}
	}
	await queryRunner.commitTransaction();
}
