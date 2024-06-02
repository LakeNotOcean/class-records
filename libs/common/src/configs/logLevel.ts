import { EnvEnum } from '../enums';

export function getLogLevel(env: EnvEnum) {
	switch (env) {
		case EnvEnum.dev:
			return 'debug';
		default:
			return 'info';
	}
}
