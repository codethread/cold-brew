import { pipe } from 'fp-ts/lib/function';
import { Do, bind, map, mapLeft } from 'fp-ts/lib/TaskEither';
import { getAllConfigDir, getAllProfiles, getConfigFiles } from './config';
import { match, P } from 'ts-pattern';
import { ErrGeneric, ErrNoEnv, ErrNoExist } from './errors';
import { failure, failures } from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';

const Class = P.instanceOf;
export function generate() {
	pipe(
		Do,
		bind('configDir', () => getAllConfigDir()),
		bind('profiles', ({ configDir }) => getAllProfiles(configDir)),
		bind('files', ({ configDir }) => getConfigFiles(configDir)),
		mapLeft((s) => {
			console.log(PathReporter.report(s));
			console.error(failures(s));
		}),
		map((s) => console.log(s))

		// read all configs
		// for each profile, recurse through and inline all the collections
		// write to file
	)();
}
