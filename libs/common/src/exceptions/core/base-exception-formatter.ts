/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgumentsHost } from '@nestjs/common';
import { IExceptionsFormatter } from './exception.module';
import { Exception } from './exceptions';

export class BaseExceptionFomratter implements IExceptionsFormatter {
    match(host: ArgumentsHost): boolean {
        return true;
    }
    format(exception: Exception, host: ArgumentsHost): unknown {
        return exception;
    }
}
