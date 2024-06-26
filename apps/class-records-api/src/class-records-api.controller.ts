import { Controller, Query } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { EntityManager } from 'typeorm';
import { BaseApiController } from './controllers/base-api.ontroller';
import { GetRequestDec } from './decorators/methods-decorators/get-request.decorator';
import { PostRequestDec } from './decorators/methods-decorators/post-request.decorator';
import { TransactionManager } from './decorators/transaction.decorator';
import { AddLessonsDto } from './dto/add-lessons.dto';
import { LessonDto } from './dto/lessons.dto';
import { ValidAddLessonsBody } from './pipes/add-lessons.pipe';
import { LessonsQuery } from './queries/lessons.query';
import { ClassRecordsApiService } from './services/class-records-api-service/class-records-api.service';

// Основной контроллер для обработки запросов
@Controller()
@ApiTags('lessons')
export class ClassRecordsApiController extends BaseApiController {
	constructor(private readonly classRecordApiService: ClassRecordsApiService) {
		super();
	}

	@GetRequestDec({
		resultType: LessonDto,
		description: 'get list of lessons',
		isResultArray: true,
		isTransaction: true,
	})
	async getlessons(
		@TransactionManager() entityManager: EntityManager,
		@Query() lessonsQuery: LessonsQuery,
	) {
		return (
			await this.classRecordApiService.getLessons(entityManager, lessonsQuery)
		).unwrap();
	}

	@PostRequestDec({
		description: 'add lesson',
		responseString: 'data added successfully',
		route: 'lessons',
		isTransaction: true,
	})
	@ApiBody({ type: AddLessonsDto })
	async addLessons(
		@TransactionManager() entityManager: EntityManager,

		@ValidAddLessonsBody()
		body: AddLessonsDto,
	) {
		await this.classRecordApiService.addLessons(entityManager, body);
	}
}
