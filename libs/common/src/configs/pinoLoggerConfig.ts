import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { toEnvEnum } from '../enums';
import { getLogLevel } from './logLevel';

export async function getPinoLoggerConfig(configService: ConfigService) {
	const env = toEnvEnum(configService.getOrThrow<string>('NODE_ENV'));
	return {
		pinoHttp: {
			level: getLogLevel(env),
			redact: ['request.headers.authorization'],
			transport: {
				target: 'pino-pretty',
				options: {
					colorize: false,
					singleLine: true,
					levelFirst: false,
					translateTime: "yyyy-mm-dd'T'HH:mm:ss.l'Z'",
					messageFormat: '{req.headers.x-correlation-id} [{context}] {msg}',
					ignore:
						'pid,hostname,service,req.headers,req.id,res.headers,res.id,context,req.remotePort,req.remoteAddress',
					errorLikeObjectKeys: ['err', 'error'],
				},
			},
			autoLogging: true,
			customProps: function () {
				return {
					env: env,
					uuid: randomUUID,
				};
			},
		},
	};
}
