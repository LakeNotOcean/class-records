import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';
import { dateValueDec } from '../decorators/values-decorators/date-value.decorator';
import { intValueDec } from '../decorators/values-decorators/int-value.decorator';
import { stringValueDec } from '../decorators/values-decorators/string-value.decorator';
import { weekDaysArrayValueDec } from '../decorators/values-decorators/week-days-array-value.decorator';

export class AddLessonsDto {
	@ApiProperty({
		type: 'number',
		required: true,
		example: [1, 2, 3, 4],
	})
	@IsArray()
	@IsNotEmpty()
	@IsInt({ each: true })
	teachersIds: number[];

	@stringValueDec({ isRequired: true, maxLength: 100 })
	title: string;

	@weekDaysArrayValueDec({ isRequired: true })
	days: number[];

	@dateValueDec({ isRequired: true })
	firstDate: Date;

	@intValueDec({ isRequired: false, minValue: 1, maxValue: 300 })
	lessonsCount?: number;

	@dateValueDec({ isRequired: false })
	lastDate?: Date;
}
