import { config } from 'dotenv';
import { join } from 'path';

const env = process.env.NODE_ENV;
if (!env) {
	throw Error('NODE_ENV is undefined');
}

const CONFIG_FILENAME = `${env}.env`;

export const generalConfig = () => {
	const path = join(__dirname, '..', '..', '..', 'env', CONFIG_FILENAME);
	const result = config({
		path: path,
	});
	result.parsed['env'] = env;
	return result;
};

export const getConfigFromPath = (pathToConfigDir: string) => {
	const configPath = join(pathToConfigDir, CONFIG_FILENAME);
	const result = config({
		path: configPath,
	});
	result.parsed['env'] = env;
	return result;
};
