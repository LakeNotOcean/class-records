import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import {
	setValidationErrorConstraint,
	ValidationException,
} from 'libs/common/src/exceptions';

@Injectable()
export class AddLessonsValidationPipe implements PipeTransform {
	transform(value: any, _metadata: ArgumentMetadata) {
		const lessonsCount = +Object.hasOwn(value, 'lessonsCount');
		const lastDate = +Object.hasOwn(value, 'lastDate');
		if (lessonsCount + lastDate != 1) {
			const error = new ValidationError();
			setValidationErrorConstraint(error, {
				key: 'addLessonsValidationPipe',
				message: 'must be either lessonsCount or lastDate',
			});
			throw new ValidationException([error]);
		}
	}
}
