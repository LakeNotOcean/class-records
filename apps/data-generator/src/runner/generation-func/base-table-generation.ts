import { EntityTarget, InsertResult, QueryRunner } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

export type GenerationFuncType<T> = {
	(): QueryDeepPartialEntity<T>;
};
export async function baseTableGeneration<T>(
	queryRunner: QueryRunner,
	entity: EntityTarget<T>,
	quantity: number,
	generationFunc: GenerationFuncType<T>,
): Promise<void> {
	await queryRunner.startTransaction();

	const promises: Promise<InsertResult>[] = [];
	for (let i = 0; i < quantity; ++i) {
		promises.push(queryRunner.manager.insert<T>(entity, generationFunc()));
	}
	await Promise.all(promises);

	await queryRunner.commitTransaction();
	return;
}
