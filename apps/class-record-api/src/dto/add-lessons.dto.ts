import { ApiExtraModels, PickType } from '@nestjs/swagger';
import { arrayValueDec } from '../decorators/values-decorators/array-value.decorator';
import { dateValueDec } from '../decorators/values-decorators/date-value.decorator';
import { intValueDec } from '../decorators/values-decorators/int-value.decorator';
import { weekDaysArrayValueDec } from '../decorators/values-decorators/week-days-array-value.decorator';
import { LessonDto } from './lessons.dto';

@ApiExtraModels(LessonDto)
export class AddLessonsDto extends PickType<LessonDto, keyof LessonDto>(
	LessonDto,
	['title'],
) {
	@arrayValueDec({ isRequired: true, targetEntity: Number })
	teachersIds: number[];

	@weekDaysArrayValueDec({ isRequired: true })
	days: number[];

	@dateValueDec({ isRequired: true })
	firstDate: Date;

	@intValueDec({ isRequired: true, minValue: 1, maxValue: 300 })
	lessonsCount?: number;

	@dateValueDec({ isRequired: false })
	lastDate?: Date;
}
