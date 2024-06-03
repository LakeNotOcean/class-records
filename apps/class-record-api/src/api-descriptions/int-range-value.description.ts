import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function getIntRangeValueDescription(): SchemaObject {
	return {
		type: 'string',
		example: '1,3',
		description: 'range from start to end inclusive "1,3"',
	};
}
