import { ApiExtraModels } from '@nestjs/swagger';
import { arrayValueDec } from '../decorators/values-decorators/array-value.decorator';
import { booleanIntValueDec } from '../decorators/values-decorators/boolean-int-value.decorator';
import { dateValueDec } from '../decorators/values-decorators/date-value.decorator';
import { intValueDec } from '../decorators/values-decorators/int-value.decorator';
import { stringValueDec } from '../decorators/values-decorators/string-value.decorator';
import { StudentDto } from './student.dto';
import { TeacherDto } from './teacher.dto';

@ApiExtraModels(StudentDto, TeacherDto)
export class LessonDto {
	constructor(args: Required<LessonDto>) {
		Object.assign(this, args);
	}
	@intValueDec({ isRequired: true })
	id: number;

	@dateValueDec({ isRequired: true })
	date: string;

	@stringValueDec({ isRequired: true })
	title: string;

	@booleanIntValueDec({ isRequired: true, isNumber: true })
	status: number;

	@intValueDec({ isRequired: true })
	visitCount: number;

	@arrayValueDec({ isRequired: true, targetEntity: StudentDto })
	students: StudentDto[];

	@arrayValueDec({ isRequired: true, targetEntity: TeacherDto })
	teachers: TeacherDto[];
}
