import { Test, TestingModule } from '@nestjs/testing';
import { ClassRecordApiController } from './class-record-api.controller';
import { ClassRecordApiService } from './class-record-api.service';

describe('ClassRecordApiController', () => {
  let classRecordApiController: ClassRecordApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ClassRecordApiController],
      providers: [ClassRecordApiService],
    }).compile();

    classRecordApiController = app.get<ClassRecordApiController>(ClassRecordApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(classRecordApiController.getHello()).toBe('Hello World!');
    });
  });
});
