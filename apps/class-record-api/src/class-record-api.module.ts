import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { generalConfig, getPinoLoggerConfig } from 'libs/common/src';
import { ExceptionsModule } from 'libs/common/src/exceptions';
import { LoggerModule } from 'nestjs-pino';
import { ClassRecordApiController } from './class-record-api.controller';
import { ClassRecordApiService } from './class-record-api.service';
import { dbModule } from './modules/database.module';

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
	providers: [ClassRecordApiService],
})
export class ClassRecordApiModule {}
