import { config } from 'dotenv';
import { join } from 'path';

const env = process.env.NODE_ENV;
if (!env) {
	throw Error('NODE_ENV is undefined');
}

const CONFIG_FILENAME = `${env}.env`;

const path = join(__dirname, '..', '..', 'env', CONFIG_FILENAME);
export const generalConfig = () => {
	const result = config({
		path: path,
	});
	result.parsed['env'] = env;
	return result;
};
