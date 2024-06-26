import { toMilliseconds } from '@common';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import {
	setValidationErrorConstraint,
	ValidationException,
} from 'libs/common/src/exceptions';
import { KEY_ADD_LESSONS_VALIDATION_PIPE } from '../constants/error-constraints.constant';
import { RawBodyDec } from '../decorators/raw-body.decorator';
import { AddLessonsDto } from '../dto/add-lessons.dto';

@Injectable()
export class AddLessonsValidationPipe implements PipeTransform<AddLessonsDto> {
	async transform(value: unknown, { metatype }: ArgumentMetadata) {
		const object = plainToInstance<AddLessonsDto, unknown>(metatype, value)[0];
		const erorrs = await validate(object);
		if (erorrs.length > 0) {
			throw erorrs;
		}

		const lessonsCount = +(
			object.lessonsCount != null && object.lessonsCount != undefined
		);
		const lastDate = +(object.lastDate != null && object.lastDate != undefined);
		if (lessonsCount + lastDate != 1) {
			const error = new ValidationError();
			setValidationErrorConstraint(error, {
				key: KEY_ADD_LESSONS_VALIDATION_PIPE,
				message: 'must be either lessonsCount or lastDate',
			});
			throw new ValidationException([error]);
		}

		if (
			object.lastDate &&
			object.firstDate.getTime() - object.lastDate.getTime() >
				toMilliseconds('1y')
		) {
			const error = new ValidationError();
			setValidationErrorConstraint(error, {
				key: KEY_ADD_LESSONS_VALIDATION_PIPE,
				message: 'date range must be no more than 1 year',
			});
			throw new ValidationException([error]);
		}

		return object;
	}
}

export const ValidAddLessonsBody = () =>
	RawBodyDec(new AddLessonsValidationPipe());
