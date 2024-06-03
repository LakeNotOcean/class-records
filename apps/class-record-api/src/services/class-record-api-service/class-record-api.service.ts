import { Injectable } from '@nestjs/common';
import { createSuccessResult, toIntBoolean, toYYYYMMDD } from 'libs/common/src';
import { EntityManager } from 'typeorm';
import { LessonDto } from '../../dto/lessons.dto';
import { StudentDto } from '../../dto/student.dto';
import { TeacherDto } from '../../dto/teacher.dto';
import { LessonsQuery } from '../../queries/lessons.query';
import { CheckService } from '../check-service/check.service';
import { getLessonsFromDb } from './get-lessons';

@Injectable()
export class ClassRecordApiService {
	constructor(private readonly checkService: CheckService) {}

	async getLessons(entityManager: EntityManager, lessonsQuery: LessonsQuery) {
		await entityManager.queryRunner.startTransaction();

		const dbResult = await getLessonsFromDb(entityManager, lessonsQuery);

		await entityManager.queryRunner.commitTransaction();

		const dtoResult = dbResult.map((r) => {
			const visitCount = r.lessonStudents.reduce(
				(acc, s) => (s.visit ? acc + 1 : acc),
				0,
			);
			return new LessonDto({
				id: r.id,
				date: toYYYYMMDD(r.date).resultData,
				title: r.title,
				visitCount,
				status: toIntBoolean(r.status).resultData,
				students: r.lessonStudents.map(
					(ls) =>
						new StudentDto({
							id: ls.studentId,
							visit: ls.visit,
							name: ls.studentsEntity.name,
						}),
				),
				teachers: r.teachers.map(
					(t) => new TeacherDto({ id: t.id, name: t.name }),
				),
			});
		});
		return createSuccessResult(dtoResult);
	}
}
