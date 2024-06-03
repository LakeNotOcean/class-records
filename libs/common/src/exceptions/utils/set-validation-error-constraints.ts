import { ValidationError } from 'class-validator';

export type errorConstraintType = {
	message: string;
	key: string;
};
export function setValidationErrorConstraint(
	exc: ValidationError,
	...errorsMessages: errorConstraintType[]
) {
	if (!exc.constraints) {
		exc.constraints = {};
	}
	for (const errorMessage of errorsMessages) {
		exc.constraints[errorMessage.key] = errorMessage.message;
	}
}
