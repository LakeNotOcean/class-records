export enum EnvEnum {
	dev = 'dev',
	release = 'release',
}

export function toEnvEnum(val: string) {
	switch (val) {
		case EnvEnum.release: {
			return EnvEnum.release;
		}
		default: {
			return EnvEnum.dev;
		}
	}
}
