import { LessonsEntity, toIntBoolean, toYYYYMMDD } from '@common';
import { ApiExtraModels } from '@nestjs/swagger';
import { arrayOfEntitiesValueDec } from '../decorators/values-decorators/array-value.decorator';
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

	@stringValueDec({ isRequired: true, maxLength: 100 })
	title: string;

	@booleanIntValueDec({ isRequired: true, isNumber: true })
	status: number;

	@intValueDec({ isRequired: true })
	visitCount: number;

	@arrayOfEntitiesValueDec({ isRequired: true, targetEntity: StudentDto })
	students: StudentDto[];

	@arrayOfEntitiesValueDec({ isRequired: true, targetEntity: TeacherDto })
	teachers: TeacherDto[];
}

export function toLessonDto(lesson: LessonsEntity): LessonDto {
	const visitCount = lesson.lessonStudents.reduce(
		(acc, s) => (s.visit ? acc + 1 : acc),
		0,
	);
	return new LessonDto({
		id: lesson.id,
		date: toYYYYMMDD(lesson.date).unwrap(),
		title: lesson.title,
		visitCount,
		status: toIntBoolean(lesson.status).unwrap(),
		students: lesson.lessonStudents.map(
			(ls) =>
				new StudentDto({
					id: ls.studentId,
					visit: ls.visit,
					name: ls.studentsEntity.name,
				}),
		),
		teachers: lesson.teachers.map(
			(t) => new TeacherDto({ id: t.id, name: t.name }),
		),
	});
}
