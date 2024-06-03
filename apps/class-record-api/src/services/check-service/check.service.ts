import { JsonLogger, TeachersEntity } from '@common';
import { Injectable } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';
import { NotExistException } from '../../exceptions/not-exists.exception';

@Injectable()
export class CheckService {
	private readonly logger = new JsonLogger(CheckService.name);

	async checkIfTeachersExists(
		entityManager: EntityManager,
		teachersIds: number[],
	) {
		const findResult = await entityManager.findBy(TeachersEntity, {
			id: In(teachersIds),
		});
		if (findResult.length == teachersIds.length) {
			return;
		}
		const idsSet = new Set(teachersIds);
		const notFoundArray = findResult.filter((r) => !idsSet.has(r.id));
		throw new NotExistException({
			message: `the following items were not found: ${notFoundArray.join(', ')}`,
		});
	}
}
