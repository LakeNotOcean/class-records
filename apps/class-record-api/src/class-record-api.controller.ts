import { Controller, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntityManager } from 'typeorm';
import { ClassRecordApiService } from './class-record-api.service';
import { BaseApiController } from './controllers/base-api.ontroller';
import { GetRequestDec } from './decorators/methods-decorators/get-request.decorator';
import { TransactionManager } from './decorators/transaction.decorator';
import { LessonDto } from './dto/lessons.dto';
import { LessonsQuery } from './queries/lessons.query';

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
	getHello(
		@TransactionManager() entityManager: EntityManager,
		@Query() lessonsQuery: LessonsQuery,
	) {
		return this.classRecordApiService.getLessons(entityManager, lessonsQuery);
	}
}
