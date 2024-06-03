import { arrayValueDec } from '../decorators/values-decorators/array-value.decorator';
import { dateValueDec } from '../decorators/values-decorators/date-value.decorator';
import { intValueDec } from '../decorators/values-decorators/int-value.decorator';
import { stringValueDec } from '../decorators/values-decorators/string-value.decorator';
import { weekDaysArrayValueDec } from '../decorators/values-decorators/week-days-array-value.decorator';

export class AddLessonsDto {
	@arrayValueDec({ isRequired: true, targetEntity: Number, maxSize: 100 })
	teachersIds: number[];

	@stringValueDec({ isRequired: true, maxLength: 100 })
	title: string;

	@weekDaysArrayValueDec({ isRequired: true })
	days: number[];

	@dateValueDec({ isRequired: true })
	firstDate: Date;

	@intValueDec({ isRequired: true, minValue: 1, maxValue: 300 })
	lessonsCount?: number;

	@dateValueDec({ isRequired: false })
	lastDate?: Date;
}
