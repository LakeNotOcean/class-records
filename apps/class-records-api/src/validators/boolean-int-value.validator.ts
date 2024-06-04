import {
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'isBooleanInt', async: false })
export class BooleanIntValudator implements ValidatorConstraintInterface {
	validate(
		value: unknown,
		_validationArguments?: ValidationArguments,
	): boolean | Promise<boolean> {
		if (typeof value === 'boolean') {
			return true;
		}
		return false;
	}
	defaultMessage?(_validationArguments?: ValidationArguments): string {
		return "value must be '1' or '0'";
	}
}

export function isBooleanInt(validationOptions?: ValidationOptions) {
	return (object: any, propertyName: string) => {
		registerDecorator({
			target: object.constructor,
			propertyName,
			options: validationOptions,
			validator: BooleanIntValudator,
		});
	};
}
