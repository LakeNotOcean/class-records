import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { generalConfig, getPinoLoggerConfig } from 'libs/common/src';
import { ExceptionsModule } from 'libs/common/src/exceptions';
import { LoggerModule } from 'nestjs-pino';
import { ClassRecordApiController } from './class-record-api.controller';
import { dbModule } from './modules/database.module';
import { CheckService } from './services/check-service/check.service';
import { ClassRecordApiService } from './services/class-record-api-service/class-record-api.service';

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
		dbModule,
	],
	controllers: [ClassRecordApiController],
	providers: [ClassRecordApiService, CheckService],
})
export class ClassRecordApiModule {}
