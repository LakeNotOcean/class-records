import { EntityTarget, QueryRunner } from 'typeorm';

export async function clearTable<T>(
	queryRunner: QueryRunner,
	entity: EntityTarget<T>,
): Promise<void> {
	await queryRunner.startTransaction();
	await queryRunner.manager.delete(entity, {});
	await queryRunner.commitTransaction();
}
