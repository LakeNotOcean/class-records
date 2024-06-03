import { ValidationError } from '@nestjs/common';
import { StatusEnum } from '../result';
import { ClientException } from './core/exceptions';

export interface RequestValidationError {
	properties: string[];
	errors: { [key: string]: string } | undefined;
	nested?: RequestValidationError[] | undefined;
}

const mapError = (error: ValidationError): RequestValidationError => ({
	properties: [error.property],
	errors: error.constraints,
	nested: error.children?.map(mapError),
});

export class ValidationException extends ClientException {
	constructor(errors: ValidationError[]) {
		super(StatusEnum.ValidationException, 'Validation failed', {
			message: 'some properties were not validated',
			validationResult: errors.map(mapError),
		});
	}
}
