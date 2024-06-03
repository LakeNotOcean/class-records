import { Transform } from 'class-transformer';
import { ValidationError } from 'class-validator';

export function TransformWithValidationErrorDec(
	transformFn: (key: string, value: unknown, error: ValidationError) => unknown,
): PropertyDecorator {
	return Transform(({ key, value }) => {
		const error = new ValidationError();
		error.property = key;
		return transformFn(key, value, error);
	});
}
