import { ConfigService } from '@nestjs/config';
import { Command, CommandRunner, Option } from 'nest-commander';
import { getDatabaseConfig } from 'src/common/dbContext/database-config';
import { LessonsEntity } from 'src/common/dbContext/entities/Lessons.entity';
import { StudentsEntity } from 'src/common/dbContext/entities/Students.entity';
import { TeachersEntity } from 'src/common/dbContext/entities/Teachers.entity';
import { TableEnum } from 'src/lib/enums/table.enum';
import { JsonLogger } from 'src/lib/loggers/base-json.logger';
import { DataSource } from 'typeorm';
import { clearTable } from './clearing-func/clear-table';
import { dbInitialization } from './utils/db-initialization';

@Command({
	name: 'data clearing',
	description: 'function to clear data in tables',
	options: { isDefault: false },
})
export class DataClearingRunner extends CommandRunner {
	private readonly dataSource: DataSource;
	private readonly logger = new JsonLogger(DataClearingRunner.name);

	constructor(configService: ConfigService) {
		super();
		this.dataSource = new DataSource(getDatabaseConfig(configService));
	}

	async run(
		_passedParams: string[],
		options: { table: TableEnum },
	): Promise<void> {
		const queryRunner = await dbInitialization(this.dataSource, this.logger);

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
		} finally {
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
			throw new Error('option must be a valid table');
		}
		return option as TableEnum;
	}
}
