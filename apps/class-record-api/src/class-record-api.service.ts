import { Injectable } from '@nestjs/common';
import {
	createSuccessResult,
	LessonsEntity,
	LessonStudentsEntity,
	StudentsEntity,
	TeachersEntity,
	toIntBoolean,
	toYYYMMDD,
} from 'libs/common/src';
import { EntityManager } from 'typeorm';
import { STUDENT_COUNT } from './constants/db.constant';
import { selectIdsForRange } from './db-queries/select-min-max-id';
import { DateRangeDto } from './dto/data-range.dto';
import { LessonDto } from './dto/lessons.dto';
import { RangeDto } from './dto/range.dto';
import { StudentDto } from './dto/student.dto';
import { TeacherDto } from './dto/teacher.dto';
import { LessonsQuery } from './queries/lessons.query';

@Injectable()
export class ClassRecordApiService {
	async getLessons(entityManager: EntityManager, lessonsQuery: LessonsQuery) {
		await entityManager.queryRunner.startTransaction();

		const [start, end] = await selectIdsForRange(
			entityManager,
			lessonsQuery.lessonsPerPage,
			lessonsQuery.lessonsPerPage * (lessonsQuery.page - 1),
		);

		let build = entityManager
			.createQueryBuilder()
			.select(['l.id', 'l.date', 'l.status'])
			.from(LessonsEntity, 'l');

		if (lessonsQuery.date) {
			if (lessonsQuery.date instanceof DateRangeDto) {
				build = build.andWhere('l.date between :start and :end', {
					start: lessonsQuery.date.start,
					end: lessonsQuery.date.end,
				});
			} else {
				build = build.andWhere('l.date = :date', { date: lessonsQuery.date });
			}
		}

		if (lessonsQuery.status) {
			build = build.andWhere('l.status = :status', {
				status: lessonsQuery.status,
			});
		}

		build = build.leftJoin('lesson_teachers', 'lt', 'l.id = lt.lesson_id');
		build = build.leftJoinAndMapMany(
			'l.teachers',
			TeachersEntity,
			't',
			'lt.teacher_id = t.id',
		);

		if (lessonsQuery.teachersIds) {
			build = build.andWhere('t.id IN (:...teachersIds)', {
				teachersIds: lessonsQuery.teachersIds,
			});
		}

		build = build.leftJoinAndMapMany(
			'l.lessonStudents',
			LessonStudentsEntity,
			'ls',
			'l.id = ls.lessonId',
		);
		build = build.leftJoinAndMapOne(
			'ls.studentId',
			StudentsEntity,
			's',
			'ls.studentId = s.id',
		);
		build = build.leftJoinAndSelect(
			(qb) => {
				return qb
					.select(['ls2.lessonId as lessonId'])
					.addSelect('COUNT(ls2.studentId)', STUDENT_COUNT)
					.from(LessonStudentsEntity, 'ls2')
					.groupBy('ls2.lessonId');
			},
			'ls2',
			'ls2.lessonId = ls.lessonId',
		);

		if (lessonsQuery.studentsCount) {
			if (lessonsQuery.studentsCount instanceof RangeDto) {
				build = build.andWhere(
					'ls2.' + STUDENT_COUNT + ' between :start and :end',
					{
						start: lessonsQuery.studentsCount.start,
						end: lessonsQuery.studentsCount.end,
					},
				);
			}
			build = build.andWhere('ls2.' + STUDENT_COUNT + ' = :count', {
				count: lessonsQuery.studentsCount,
			});
		}
		build = build.andWhere('l.id between :start and :end', { start, end });

		const dbResult = await build.getMany();
		await entityManager.queryRunner.commitTransaction();

		const dtoResult = dbResult.map((r) => {
			const visitCount = r.lessonStudents.reduce(
				(acc, s) => (s.visit ? acc + 1 : acc),
				0,
			);
			return new LessonDto({
				id: r.id,
				date: toYYYMMDD(r.date).resultData,
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
