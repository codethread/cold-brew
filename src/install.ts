import { pipe } from 'fp-ts/lib/function';
import { Do, bind, map, mapLeft } from 'fp-ts/lib/TaskEither';
import { getAllConfigDir, getAllProfiles } from './config';
import { match, P } from 'ts-pattern';
import { ErrGeneric, ErrNoEnv, ErrNoExist } from './errors';

const Class = P.instanceOf;

export function install(brewPackage: string) {
	pipe(
		Do,
		bind('configDir', () => getAllConfigDir()),
		bind('profiles', ({ configDir }) => getAllProfiles(configDir)),
		mapLeft((s) => console.error(s.stack)),
		map((s) => console.log(s))
	)();
}
