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
		value: string,
		_validationArguments?: ValidationArguments,
	): boolean | Promise<boolean> {
		if (value == '0' || value == '1') {
			return true;
		}
		return false;
	}
	defaultMessage?(_validationArguments?: ValidationArguments): string {
		return 'value must be 1 or 0';
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
