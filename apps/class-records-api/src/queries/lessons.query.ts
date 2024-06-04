import { booleanIntValueDec } from '../decorators/values-decorators/boolean-int-value.decorator';
import { dateOrRangeValueDec } from '../decorators/values-decorators/complex-values/date-or-range-value.decorator';
import { intOrRangeValueDec } from '../decorators/values-decorators/complex-values/int-or-range-value.decorator';
import { intSeparatedByCommasValueDec } from '../decorators/values-decorators/int-separated-by-commas-value.decorator';
import { intValueDec } from '../decorators/values-decorators/int-value.decorator';
import { DateRangeDto } from '../dto/data-range.dto';
import { RangeDto } from '../dto/range.dto';

export class LessonsQuery {
	@dateOrRangeValueDec({ isRequired: false })
	date?: Date | DateRangeDto;

	@booleanIntValueDec({ isRequired: false })
	status?: boolean;

	@intSeparatedByCommasValueDec({ isRequired: false })
	teachersIds?: number[];

	@intOrRangeValueDec({ isRequired: false })
	studentsCount?: number[] | RangeDto;

	@intValueDec({ isRequired: false, minValue: 1, maxValue: 10000 })
	page = 1;

	@intValueDec({ isRequired: false, minValue: 1, maxValue: 100 })
	lessonsPerPage = 5;
}
