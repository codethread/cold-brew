import {
	nonEmptyArray as NEA,
	readonlyNonEmptyArray as AA,
	array as A,
	option as O,
	string as S,
	ioOption as IoO,
	either as E,
	task as T,
	taskOption as TO,
	taskEither as TE,
	predicate as P,
} from 'fp-ts';
import { flow, not, pipe } from 'fp-ts/lib/function';
import { info } from './logger';
import { homedir } from 'os';
import { basename, join, dirname } from 'path';
import { make } from 'ts-brand';
import { bail } from './bail';
import {
	ErrInvalidFileName,
	ErrNoEnv,
	ErrNoExist,
	ErrNoProfiles,
} from './errors';
import { pathExists, readDir, readEnv } from './io';
import { memo, memo0 } from './memo';
import { parseConfig } from './schema';

enum userEnvs {
	bundleFile = 'HOMEBREW_BUNDLE_FILE',
}

function _getConfigEnv() {
	return pipe(
		T.fromIO(readEnv(userEnvs.bundleFile)),
		TE.fromTaskOption(() => new ErrNoEnv(userEnvs.bundleFile)),
		TE.chainW(pathExists)
	);
}
const getConfigEnv = memo0(_getConfigEnv);

export function getConfigFiles(dir: ConfigDir) {
	return pipe(
		dir,
		readDir,
		TE.map(A.filter(P.and(S.endsWith('json'))(P.not(S.endsWith('lock.json'))))),
		TE.map(
			flow(
				NEA.fromArray,
				O.getOrElseW(() => bail('could not get a non empty array'))
			)
		),
		TE.chainW(
			flow(
				A.map((profile) => pipe(profile, parseConfig(dir))),
				E.sequenceArray,
				TE.fromEither
			)
		)
	);
}

export function getAllConfigDir() {
	return pipe(getConfigEnv(), TE.chainW(getConfigDirPath));
}

export function getAllProfiles(dir: ConfigDir) {
	return pipe(dir, readDir, TE.chain(flow(nameToProfile, TE.fromEither)));
}

function nameToProfile(
	file: string[]
): E.Either<ErrNoProfiles, NEA.NonEmptyArray<string>> {
	return pipe(
		file,
		A.filter(P.and(S.startsWith('Brewfile'))(S.endsWith('conf'))),
		NEA.fromArray,
		E.fromOption(() => new ErrNoProfiles()),
		E.chain(
			flow(
				NEA.map((s) =>
					pipe(
						s.split('.'),
						A.lookup(1),
						E.fromOption(() => new ErrInvalidFileName(s))
					)
				),
				E.sequenceArray,
				E.map(
					flow(
						AA.fromReadonlyArray,
						O.getOrElseW(() => bail('could not get a non empty array')),
						NEA.fromReadonlyNonEmptyArray
					)
				)
			)
		)
	);
}

function getConfigDirPath(
	path: ValidPath
): TE.TaskEither<ErrNoExist, ConfigDir> {
	return pipe(path, dirname, pathExists, TE.map(make<ConfigDir>()));
}
