import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function getIntArrayFromStringDescription(): SchemaObject {
	return {
		type: 'string',
		example: '1,2,3,4',
		description: 'positive numbers separated by commas',
	};
}
