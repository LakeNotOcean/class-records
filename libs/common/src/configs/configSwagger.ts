import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvEnum } from '../enums';

export const configSwagger = (nodeApp: INestApplication<any>, env: EnvEnum) => {
	if (env == EnvEnum.release) {
		return;
	}
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const foundVersion = require('../../../../package.json')?.version;
	const version = foundVersion ? foundVersion : 'unknown';
	const swaggerConfig = new DocumentBuilder()
		.setTitle('Class Records API')
		.setDescription('## API for class-records')
		.setVersion(version)
		.build();

	const document = SwaggerModule.createDocument(nodeApp, swaggerConfig);
	SwaggerModule.setup(`swagger`, nodeApp, document);
};
