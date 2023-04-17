import { Brand } from 'ts-brand';

declare global {
	/** a validated path to an existing file/dir */
	type ValidPath = Brand<string, 'ValidPath'>;

	/** a validated path to the users config directory */
	type ConfigDir = Brand<string, 'ConfigDir'>;

	/** the users profile */
	type UserProfile = Brand<string, 'UserProfile'>;
}
