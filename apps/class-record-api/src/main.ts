import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationException } from 'libs/common/src/exceptions';
import { Logger } from 'nestjs-pino';
import { ClassRecordApiModule } from './class-record-api.module';
import { BaseInterceptor } from './inteceptors/base.inteceptor';

async function bootstrap() {
	const app = await NestFactory.create(ClassRecordApiModule);

	const configService = app.get(ConfigService);

	app.useGlobalPipes(
		new ValidationPipe({
			disableErrorMessages: false,
			transform: true,
			exceptionFactory: (errors) => new ValidationException(errors),
		}),
	);

	app.useGlobalInterceptors(
		new ClassSerializerInterceptor(app.get(Reflector)),
		new BaseInterceptor(),
	);
	app.useLogger(app.get(Logger));

	const port = configService.getOrThrow<number>('serverPort');
	const address = configService.getOrThrow<string>('serverAddress');
	await app.listen(port, address);
	console.log('server run on port ' + port, address);
}
bootstrap();
