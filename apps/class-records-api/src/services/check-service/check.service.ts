import { JsonLogger, TeachersEntity } from '@common';
import { Injectable } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';
import { NotExistException } from '../../exceptions/not-exists.exception';

// Сервис для проверки наличия данных в БД перед выполнением запроса
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
		findResult.forEach((r) => idsSet.delete(r.id));
		throw new NotExistException({
			message: `the following items were not found: ${teachersIds.join(', ')}`,
		});
	}
}
