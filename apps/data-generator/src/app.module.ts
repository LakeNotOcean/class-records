import { generalConfig } from '@common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataClearingCommand } from './runner/data-cleansing-command';
import { DataGeneratorCommand } from './runner/data-generator-command';

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: true,
			isGlobal: true,
			cache: true,
			load: [generalConfig],
		}),
	],
	providers: [DataGeneratorCommand, DataClearingCommand],
})
export class AppModule {}
