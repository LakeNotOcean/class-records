import { Body, Controller, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntityManager } from 'typeorm';
import { BaseApiController } from './controllers/base-api.ontroller';
import { GetRequestDec } from './decorators/methods-decorators/get-request.decorator';
import { PostRequestDec } from './decorators/methods-decorators/post-request.decorator';
import { TransactionManager } from './decorators/transaction.decorator';
import { AddLessonsDto } from './dto/add-lessons.dto';
import { LessonDto } from './dto/lessons.dto';
import { AddLessonsValidationPipe } from './pipes/add-lessons.pipe';
import { LessonsQuery } from './queries/lessons.query';
import { ClassRecordApiService } from './services/class-record-api-service/class-record-api.service';

@Controller()
@ApiTags('lessons')
export class ClassRecordApiController extends BaseApiController {
	constructor(private readonly classRecordApiService: ClassRecordApiService) {
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
	async addLessons(
		@TransactionManager() entityManager: EntityManager,
		@Body(new AddLessonsValidationPipe()) body: AddLessonsDto,
	) {
		await this.classRecordApiService.addLessons(entityManager, body);
	}
}
