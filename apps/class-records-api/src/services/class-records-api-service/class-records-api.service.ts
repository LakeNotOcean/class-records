import { Injectable } from '@nestjs/common';
import { createEmptyResult, createSuccessResult } from 'libs/common/src';
import { EntityManager } from 'typeorm';
import { AddLessonsDto } from '../../dto/add-lessons.dto';
import { toLessonDto } from '../../dto/lessons.dto';
import { LessonsQuery } from '../../queries/lessons.query';
import { CheckService } from '../check-service/check.service';
import { addLessonsToDb } from './add-lessons';
import { getLessonsFromDb } from './get-lessons';

@Injectable()
export class ClassRecordsApiService {
	constructor(private readonly checkService: CheckService) {}

	async getLessons(entityManager: EntityManager, lessonsQuery: LessonsQuery) {
		await entityManager.queryRunner.startTransaction();

		const dbResult = await getLessonsFromDb(entityManager, lessonsQuery);

		await entityManager.queryRunner.commitTransaction();

		const dtoResult = dbResult.map((r) => toLessonDto(r));
		return createSuccessResult(dtoResult);
	}

	async addLessons(entityManager: EntityManager, dto: AddLessonsDto) {
		await entityManager.queryRunner.startTransaction();

		await addLessonsToDb(entityManager, this.checkService, dto);

		await entityManager.queryRunner.commitTransaction();

		return createEmptyResult();
	}
}
