import { PickType } from '@nestjs/swagger';
import { booleanDec } from '../decorators/values-decorators/boolean-value.decorator';
import { TeacherDto } from './teacher.dto';

export class StudentDto extends PickType<TeacherDto, keyof TeacherDto>(
	TeacherDto,
	['id', 'name'],
) {
	constructor(args: Required<StudentDto>) {
		super();
		Object.assign(this, args);
	}
	@booleanDec({ isRequired: true })
	visit: boolean;
}
