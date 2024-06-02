import { Injectable } from '@nestjs/common';

@Injectable()
export class ClassRecordApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
