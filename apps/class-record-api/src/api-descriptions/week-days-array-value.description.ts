import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function getWeekDaysArrayValueDescription(): SchemaObject {
	return {
		type: 'array',
		example: [0, 1, 2, 3, 4, 5, 6],
		description:
			'an array with the selected days of the week. 0 - Sunday, 6 - Saturday',
	};
}
