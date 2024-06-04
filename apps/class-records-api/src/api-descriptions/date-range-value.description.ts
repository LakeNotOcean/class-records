import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function getDateRangeValueDescription(): SchemaObject {
	return {
		type: 'string',
		example: '2020-03-12,2021-07-30',
		description: 'range from first date to second date inclusive',
	};
}
