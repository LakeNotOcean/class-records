import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { JsonLogger } from 'libs/common/src';

// абстрактный контроллер для формирования ответов
// на данный момент его возможности не используются
export abstract class BaseApiController {
	private readonly logger = new JsonLogger(BaseApiController.name);
	protected OkEmpty(response: Response): void {
		response.statusCode = HttpStatus.OK;
		response.send();
	}
	protected Ok<T>(response: Response, body?: T) {
		response.status(HttpStatus.OK).send(body);
	}
	protected Created<T>(response: Response, body: T) {
		response.statusCode = HttpStatus.CREATED;
		response.send(body);
	}
	protected MetadataException<T>(response: Response, body: T) {
		response.statusCode = 502;
		response.send(body);
	}
	protected Forbidden() {
		throw new HttpException(
			{
				status: HttpStatus.FORBIDDEN,
				message: 'No rights to perform action',
			},
			HttpStatus.FORBIDDEN,
		);
	}
	protected BadRequest(message = 'Bad request') {
		throw new HttpException(
			{ status: HttpStatus.BAD_REQUEST, message: message },
			HttpStatus.BAD_REQUEST,
		);
	}
	protected NotFound(message = 'Not Found') {
		throw new HttpException(
			{
				status: HttpStatus.NOT_FOUND,
				message: message,
			},
			HttpStatus.NOT_FOUND,
		);
	}
	protected InternalError(message?: string) {
		if (message) this.logger.error(message);
		throw new HttpException(
			{
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				message: message,
			},
			HttpStatus.INTERNAL_SERVER_ERROR,
		);
	}
}
