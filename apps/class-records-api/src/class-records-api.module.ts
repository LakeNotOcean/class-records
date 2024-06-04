import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { generalConfig, getPinoLoggerConfig } from 'libs/common/src';
import { ExceptionsModule } from 'libs/common/src/exceptions';
import { LoggerModule } from 'nestjs-pino';
import { ClassRecordsApiController } from './class-records-api.controller';
import { dbModule } from './modules/database.module';
import { CheckService } from './services/check-service/check.service';
import { ClassRecordsApiService } from './services/class-records-api-service/class-records-api.service';

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
	controllers: [ClassRecordsApiController],
	providers: [ClassRecordsApiService, CheckService],
})
export class ClassRecordsApiModule {}
