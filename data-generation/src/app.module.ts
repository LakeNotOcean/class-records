import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { generalConfig } from 'src/common/configs/config';
import { DataClearingRunner } from './runner/data-clearing-runner';
import { DataGeneratorRunner } from './runner/data-generator-runner';

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: true,
			isGlobal: true,
			cache: true,
			load: [generalConfig],
		}),
	],
	providers: [DataGeneratorRunner, DataClearingRunner],
})
export class AppModule {}
