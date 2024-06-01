import { LessonsEntity } from 'src/common/dbContext/entities/Lessons.entity';
import { LessonStudentsEntity } from 'src/common/dbContext/entities/LessonStudents.entity';
import { StudentsEntity } from 'src/common/dbContext/entities/Students.entity';
import { TeachersEntity } from 'src/common/dbContext/entities/Teachers.entity';
import { getRandomDate } from 'src/lib/random-utils/get-random-date';
import { getRandomElementsFromArray } from 'src/lib/random-utils/get-random-from-array';
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

	for (let i = 0; i < quantity; ++i) {
		promises.push(
			manager
				.createQueryBuilder()
				.insert()
				.into(LessonsEntity)
				.values({
					date: getRandomDate(minDate, maxDate),
					status: Math.random() < 0.8 ? true : false,
				})
				.returning(['id'])
				.execute(),
		);
	}

	const insertResults = await Promise.all(promises);
	for await (const insertResult of insertResults) {
		const selectedTeachersIds = getRandomElementsFromArray(teachersIds);
		const selectedStudentsIds = getRandomElementsFromArray(studentsIds);

		const lessonId = insertResult.raw[0].id as number;
		for await (const teacherId of selectedTeachersIds) {
			await manager
				.createQueryBuilder('lesson_teachers', 'lt')
				.insert()
				.values({ id_lesson: lessonId, id_teacher: teacherId })
				.execute();
		}
		for await (const studentId of selectedStudentsIds) {
			await manager
				.createQueryBuilder()
				.insert()
				.into(LessonStudentsEntity)
				.values({
					idLesson: lessonId,
					idStudent: studentId,
					visit: Math.random() < 0.8 ? true : false,
				})
				.execute();
		}
	}
	await queryRunner.commitTransaction();
}
