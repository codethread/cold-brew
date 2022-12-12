export const serviceEnv = {} as const;

export type ServiceEnv = typeof serviceEnv;

export const configEnv = {};

export type ConfigEnv = {
	logLevel: 'info' | 'warn';
    /** path to user collections, including a valid profile */
	configPath: string;
    /** User profile to convert to a brewfile */
	profile: string;
};
