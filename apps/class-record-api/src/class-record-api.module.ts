import { Module } from '@nestjs/common';
import { ClassRecordApiController } from './class-record-api.controller';
import { ClassRecordApiService } from './class-record-api.service';

@Module({
  imports: [],
  controllers: [ClassRecordApiController],
  providers: [ClassRecordApiService],
})
export class ClassRecordApiModule {}
