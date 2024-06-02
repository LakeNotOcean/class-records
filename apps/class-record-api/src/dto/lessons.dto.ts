import { ApiExtraModels } from '@nestjs/swagger';
import { arrayValueDec } from '../decorators/array-value.decorator';
import { booleanIntValueDec } from '../decorators/boolean-int-value.decorator';
import { dateValueDecorator } from '../decorators/date-value.decorator';
import { intValueDec } from '../decorators/int-value.decorator';
import { stringValueDec } from '../decorators/string-value.decorator';
import { StudentDto } from './student.dto';
import { TeacherDto } from './teacher.dto';

@ApiExtraModels(StudentDto, TeacherDto)
export class LessonsDto {
	@intValueDec({ isRequired: true })
	id: number;

	@dateValueDecorator({ isRequired: true })
	date: string;

	@stringValueDec({ isRequired: true })
	title: string;

	@booleanIntValueDec({ isRequired: true })
	status: number;

	@intValueDec({ isRequired: true })
	visitCount: number;

	@arrayValueDec({ isRequired: true, targetEntity: StudentDto })
	students: StudentDto[];

	@arrayValueDec({ isRequired: true, targetEntity: TeacherDto })
	teachers: TeacherDto[];
}
