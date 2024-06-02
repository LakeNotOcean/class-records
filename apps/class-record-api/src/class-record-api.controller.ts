import { Controller, Get } from '@nestjs/common';
import { ClassRecordApiService } from './class-record-api.service';

@Controller()
export class ClassRecordApiController {
  constructor(private readonly classRecordApiService: ClassRecordApiService) {}

  @Get()
  getHello(): string {
    return this.classRecordApiService.getHello();
  }
}
