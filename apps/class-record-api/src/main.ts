import { NestFactory } from '@nestjs/core';
import { ClassRecordApiModule } from './class-record-api.module';

async function bootstrap() {
  const app = await NestFactory.create(ClassRecordApiModule);
  await app.listen(3000);
}
bootstrap();
