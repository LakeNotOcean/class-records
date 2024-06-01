import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import { Command, CommandRunner, Option } from 'nest-commander';
import { getDatabaseConfig } from 'src/common/dbContext/database-config';
import { StudentsEntity } from 'src/common/dbContext/entities/Students.entity';
import { TeachersEntity } from 'src/common/dbContext/entities/Teachers.entity';
import { JsonLogger } from 'src/lib/loggers/base-json.logger';
import { DataSource } from 'typeorm';
import { TableEnum } from '../../../src/lib/enums/table.enum';
import { baseTableGeneration } from './generation-func/base-table-generation';
import { lessonsTableGeneration } from './generation-func/lessons-table-generation';
import { dbInitialization } from './utils/db-initialization';

@Command({
	name: 'data generator',
	description: 'generating fake data for a given table of a certain quantity',
	options: { isDefault: false },
})
export class DataGeneratorRunner extends CommandRunner {
	private readonly dataSource: DataSource;
	private readonly logger = new JsonLogger(DataGeneratorRunner.name);

	constructor(configService: ConfigService) {
		super();
		this.dataSource = new DataSource(getDatabaseConfig(configService));
	}

	async run(
		_passedParams: string[],
		options: { table: TableEnum; quantity: number },
	): Promise<void> {
		const queryRunner = await dbInitialization(this.dataSource, this.logger);

		try {
			switch (options.table) {
				case TableEnum.lessons: {
					await lessonsTableGeneration(queryRunner, options.quantity);
					break;
				}
				case TableEnum.students: {
					await baseTableGeneration<StudentsEntity>(
						queryRunner,
						StudentsEntity,
						options.quantity,
						() => {
							return { name: faker.person.fullName };
						},
					);
					break;
				}
				case TableEnum.teachers: {
					await baseTableGeneration<TeachersEntity>(
						queryRunner,
						TeachersEntity,
						options.quantity,
						() => {
							return { name: faker.person.fullName };
						},
					);
					break;
				}
			}
			this.logger.log('data generated successfully');
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
		return;
	}

	@Option({
		flags: '-t, --table <table>',
		name: 'table',
		description: 'selected table',
		required: true,
	})
	parseTableOption(option: string): TableEnum {
		if (!Object.values<string>(TableEnum).includes(option)) {
			throw new Error('option must be a valid table');
		}
		return option as TableEnum;
	}

	@Option({
		flags: '-q, --quantity <quantity>',
		name: 'quantity',
		description: 'quantity of rows',
		required: true,
	})
	parseQuantityOption(option: string): number {
		const parseResult = parseInt(option);
		if (!parseResult || parseResult < 0 || parseResult < 2 * Math.pow(10, 9)) {
			throw new Error('quantity must be a positive integer less than 2*10^9');
		}
		return parseInt(option);
	}
}
