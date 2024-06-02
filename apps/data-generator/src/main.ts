import { JsonLogger } from '@common';
import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

async function bootstrap() {
	await CommandFactory.run(AppModule, new JsonLogger('Commander'));
}
bootstrap();
