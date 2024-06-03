import { StatusEnum } from '@common';
import {
	BusinessException,
	ExceptionPayload,
} from 'libs/common/src/exceptions';

export class NotExistException extends BusinessException {
	constructor(payload: ExceptionPayload) {
		super(StatusEnum.NotExistException, 'element does not exist', payload);
	}
}
