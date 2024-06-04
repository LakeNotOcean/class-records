import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from 'libs/common/src';
import { types } from 'pg';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => {
				types.setTypeParser(
					1114,
					(stringValue) => new Date(`${stringValue}+0000`),
				);
				return getDatabaseConfig(config);
			},
			inject: [ConfigService],
		}),
	],
})
export class dbModule {}
