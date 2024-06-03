import {
	LessonsEntity,
	LessonStudentsEntity,
	StudentsEntity,
	TeachersEntity,
} from '@common';
import { EntityManager } from 'typeorm';
import { STUDENT_COUNT } from '../../constants/db.constant';
import { selectIdsForRange } from '../../db-queries/select-min-max-id';
import { DateRangeDto } from '../../dto/data-range.dto';
import { RangeDto } from '../../dto/range.dto';
import { LessonsQuery } from '../../queries/lessons.query';

export async function getLessonsFromDb(
	entityManager: EntityManager,
	lessonsQuery: LessonsQuery,
) {
	const [startId, endId] = await selectIdsForRange(
		entityManager,
		LessonsEntity,
		'id',
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
	build = build.andWhere('l.id between :startId and :endId', {
		startId,
		endId,
	});

	const dbResult = await build.getMany();

	return dbResult;
}
