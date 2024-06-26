import { intValueDec } from '../decorators/values-decorators/int-value.decorator';
import { stringValueDec } from '../decorators/values-decorators/string-value.decorator';

export class TeacherDto {
	constructor(args: Required<TeacherDto>) {
		Object.assign(this, args);
	}
	@intValueDec({ isRequired: true })
	id: number;
	@stringValueDec({ isRequired: true })
	name: string;
}
