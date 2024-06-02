import { createAndFillArray, MAX_BULK } from '@common';
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
	for (let i = 0; i < quantity; i += MAX_BULK) {
		const data = createAndFillArray(
			quantity > MAX_BULK ? MAX_BULK : quantity,
			generationFunc,
		);
		promises.push(queryRunner.manager.insert<T>(entity, data));
	}
	const promiseResults = await Promise.allSettled(promises);
	promiseResults.forEach((r) => {
		if (r.status == 'rejected') {
			throw new Error(r.reason);
		}
	});

	await queryRunner.commitTransaction();
	return;
}
