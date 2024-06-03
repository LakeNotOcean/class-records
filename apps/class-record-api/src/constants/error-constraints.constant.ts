import { errorConstraintType } from 'libs/common/src/exceptions';

export const IS_NOT_A_STRING: errorConstraintType = {
	key: 'valueIsNotAString',
	message: 'property must be a valid string',
};

export const IS_NOT_AN_ARRAY: errorConstraintType = {
	key: 'valueIsNotAnArray',
	message: 'property must be a valid array',
};

export const KEY_ADD_LESSONS_VALIDATION_PIPE = 'addLessonsValidationPipe';
