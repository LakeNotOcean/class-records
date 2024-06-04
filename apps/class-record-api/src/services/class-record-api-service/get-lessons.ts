import { toYYYYMMDD } from '@common';
import { LessonsView } from 'libs/common/src/dbContext/views/lessons.view';
import { EntityManager } from 'typeorm';
import { DateRangeDto } from '../../dto/data-range.dto';
import { RangeDto } from '../../dto/range.dto';
import { lessonsViewToLessonsEntity } from '../../entities-utils/lessons-view-to-lessons-entity';
import { getIntIdRangeForQuery } from '../../entities-utils/select-min-max-id';
import { LessonsQuery } from '../../queries/lessons.query';

export async function getLessonsFromDb(
	entityManager: EntityManager,
	queryParams: LessonsQuery,
) {
	const build = entityManager
		.getRepository(LessonsView)
		.createQueryBuilder('l');

	if (queryParams.date) {
		if (queryParams.date instanceof DateRangeDto) {
			build.andWhere('l.lessonDate >= :startDate and l.lessonDate<= :endDate', {
				startDate: toYYYYMMDD(queryParams.date.start).unwrap(),
				endDate: toYYYYMMDD(queryParams.date.end).unwrap(),
			});
		} else {
			build.andWhere('l.lessonDate = :date', {
				date: toYYYYMMDD(queryParams.date).unwrap(),
			});
		}
	}

	if (queryParams.status) {
		build.andWhere('l.lessonStatus = :status', {
			status: queryParams.status,
		});
	}

	if (queryParams.teachersIds) {
		build.andWhere('l.teacherId IN (:...teachersIds)', {
			teachersIds: queryParams.teachersIds,
		});
	}

	if (queryParams.studentsCount) {
		if (queryParams.studentsCount instanceof RangeDto) {
			build.andWhere('l.studentCount between :startCount and :endCount', {
				startCount: queryParams.studentsCount.start,
				endCount: queryParams.studentsCount.end,
			});
		} else {
			build.andWhere('l.studentCount = :studentCount', {
				studentCount: queryParams.studentsCount,
			});
		}
	}

	const offset = queryParams.lessonsPerPage * (queryParams.page - 1);
	const range = await getIntIdRangeForQuery(
		build.clone(),
		'l.lessonId',
		offset + 1,
		offset + queryParams.lessonsPerPage,
	);
	build.andWhere('l.lessonId >= :startId and l.lessonId <= :endId', {
		startId: range.start,
		endId: range.end,
	});
	build.select();

	const dbResult = await build.getMany();

	return lessonsViewToLessonsEntity(dbResult);
}
