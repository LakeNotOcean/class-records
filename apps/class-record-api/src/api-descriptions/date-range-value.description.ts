import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function getDateRangeValueDescription(): SchemaObject {
	return {
		type: 'string',
		example: 'YYYY-MM-DD,YYYY-MMM-DD',
		description: 'range from first date to second date inclusive',
	};
}
