import { generalConfig, getPinoLoggerConfig } from '@common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExceptionsModule } from 'libs/common/src/exceptions';
import { LoggerModule } from 'nestjs-pino';
import { ClassRecordApiController } from './class-record-api.controller';
import { ClassRecordApiService } from './class-record-api.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: true,
			isGlobal: true,
			cache: true,
			load: [generalConfig],
		}),
		ExceptionsModule.forRoot(),
		LoggerModule.forRootAsync({
			useFactory: async (configService: ConfigService) =>
				getPinoLoggerConfig(configService),
			inject: [ConfigService],
		}),
	],
	controllers: [ClassRecordApiController],
	providers: [ClassRecordApiService],
})
export class ClassRecordApiModule {}
