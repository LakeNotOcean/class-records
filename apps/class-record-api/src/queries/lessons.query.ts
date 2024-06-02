import { booleanIntValueDec } from '../decorators/boolean-int-value.decorator';
import { dateOrRangeValueDec } from '../decorators/date-or-range-value.decorator';
import { intOrRangeValueDec } from '../decorators/int-or-range-value.decorator';
import { intValueDec } from '../decorators/int-value.decorator';
import { DateRangeDto } from '../dto/data-range.dto';
import { RangeDto } from '../dto/range.dto';

export class LessonsQuery {
	@dateOrRangeValueDec({ isRequired: false })
	date?: Date | DateRangeDto;

	@booleanIntValueDec({ isRequired: false })
	status?: boolean;

	@intOrRangeValueDec({ isRequired: false })
	studentsCount?: number[] | RangeDto;

	@intValueDec({ isRequired: false, minValue: 1, maxValue: 10000 })
	page = 1;

	@intValueDec({ isRequired: false, minValue: 1, maxValue: 100 })
	lessons = 5;
}
