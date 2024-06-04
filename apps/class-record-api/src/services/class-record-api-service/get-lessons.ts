import {
	LessonsEntity,
	LessonStudentsEntity,
	StudentsEntity,
	TeachersEntity,
	toYYYYMMDD,
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
	let build = entityManager
		.createQueryBuilder()
		//.select(['l.id', 'l.date', 'l.status', 'l.title'])
		.from(LessonsEntity, 'l');

	if (lessonsQuery.date) {
		if (lessonsQuery.date instanceof DateRangeDto) {
			build = build.andWhere('l.date >= :startDate and l.date<= :endDate', {
				startDate: toYYYYMMDD(lessonsQuery.date.start).unwrap(),
				endDate: toYYYYMMDD(lessonsQuery.date.end).unwrap(),
			});
		} else {
			build = build.andWhere('l.date = :date', {
				date: toYYYYMMDD(lessonsQuery.date).unwrap(),
			});
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
		'ls.studentsEntity',
		StudentsEntity,
		's',
		'ls.studentId = s.id',
	);
	build = build.leftJoinAndSelect(
		(qb) => {
			return qb
				.select(['ls2.lessonId as lessonId'])
				.addSelect('COUNT(ls2.studentId)::int', STUDENT_COUNT)
				.from(LessonStudentsEntity, 'ls2')
				.groupBy('ls2.lessonId');
		},
		'ls2',
		'ls2.lessonId = ls.lessonId',
	);

	if (lessonsQuery.studentsCount) {
		if (lessonsQuery.studentsCount instanceof RangeDto) {
			build = build.andWhere(
				'ls2.' + STUDENT_COUNT + ' between :startCount and :endCount',
				{
					startCount: lessonsQuery.studentsCount.start,
					endCount: lessonsQuery.studentsCount.end,
				},
			);
		} else {
			build = build.andWhere('ls2.' + STUDENT_COUNT + ' = :studentCount', {
				studentCount: lessonsQuery.studentsCount,
			});
		}
	}

	const [startId, endId] = await selectIdsForRange(
		build,
		'l.id',
		lessonsQuery.lessonsPerPage,
		lessonsQuery.lessonsPerPage * (lessonsQuery.page - 1),
	);
	build = build.addSelect(['l.id', 'l.date', 'l.status', 'l.title']);
	build = build.andWhere('l.id between :startId and :endId', {
		startId,
		endId,
	});
	const dbResult = await build.getMany();

	return dbResult;
}
