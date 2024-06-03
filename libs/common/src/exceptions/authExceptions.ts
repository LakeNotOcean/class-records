import { StatusEnum } from '../result';
import {
	AuthenticationException,
	AuthorisationException,
} from './core/exceptions';

export class UserAuthenticationException extends AuthenticationException {
	constructor() {
		super(StatusEnum.AuthenticationFailed, 'failed to log in');
	}
}

export class UserAuthorizationException extends AuthorisationException {
	constructor() {
		super(StatusEnum.AuthorizationFailed, 'failed to authorization');
	}
}

export class AccessTokenException extends AuthenticationException {
	constructor() {
		super(StatusEnum.AuthenticationFailed, 'access token was not provided');
	}
}

export class RefreshTokenException extends AuthenticationException {
	constructor() {
		super(
			StatusEnum.AuthenticationFailed,
			'refresh token was not provided or expired',
		);
	}
}

export class CSRFTokenException extends AuthenticationException {
	constructor() {
		super(
			StatusEnum.AuthorizationFailed,
			'csrf tokens do not match or not provided',
		);
	}
}
