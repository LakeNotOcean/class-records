import {
	getDatabaseConfig,
	JsonLogger,
	LessonsEntity,
	StudentsEntity,
	TableEnum,
	TeachersEntity,
} from '@common';
import { ConfigService } from '@nestjs/config';
import { Command, CommandRunner, Option } from 'nest-commander';
import { DataSource } from 'typeorm';
import { clearTable } from './cleansing-func/clear-table';
import { dbInitialization } from './utils/db-initialization';
@Command({
	name: 'data-cleansing',
	description: 'function to clear data in tables',
	options: { isDefault: false },
})
export class DataClearingCommand extends CommandRunner {
	private readonly dataSource: DataSource;
	private readonly logger = new JsonLogger(DataClearingCommand.name);

	constructor(configService: ConfigService) {
		super();
		this.dataSource = new DataSource(getDatabaseConfig(configService));
	}

	async run(
		_passedParams: string[],
		options: { table: TableEnum },
	): Promise<void> {
		const queryRunner = await dbInitialization(this.dataSource, this.logger);
		this.logger.log('start of cleaning...');

		try {
			await clearTable(queryRunner, LessonsEntity);
			switch (options.table) {
				case TableEnum.lessons: {
					break;
				}
				case TableEnum.students: {
					await clearTable(queryRunner, StudentsEntity);
					break;
				}
				case TableEnum.teachers: {
					await clearTable(queryRunner, TeachersEntity);
					break;
				}
			}
		} catch (error) {
			this.logger.error(error);
			return;
		} finally {
			this.logger.log('completion of processing...');
			if (queryRunner.isTransactionActive) {
				await queryRunner.rollbackTransaction();
			}
			if (!queryRunner.isReleased) {
				await queryRunner.release();
			}
		}
	}

	@Option({
		flags: '-t, --table <table>',
		name: 'table',
		description: 'selected table (the "lessons" is always deleted)',
		required: true,
	})
	parseTableOption(option: string): TableEnum {
		if (!Object.values<string>(TableEnum).includes(option)) {
			throw new Error('option must be a valid table\n');
		}
		return option as TableEnum;
	}
}
