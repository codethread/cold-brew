import {
	array as A,
	option as O,
	taskEither as TE,
	taskOption as TO,
	ioOption as IoO,
} from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { promises } from 'fs';
import { make } from 'ts-brand';
import { liftToErr } from './predicates';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import { failure } from 'io-ts/PathReporter';
import { ErrGeneric, ErrNoExist } from './errors';

const { readdir, access } = promises;

const ValidPath = make<ValidPath>();

/**
 * check a path exists, and returns the path if so
 */
function pathExistsIo(path: string): TO.TaskOption<ValidPath> {
	return TO.tryCatch(() => access(path).then(() => ValidPath(path)));
}

export function pathExists(path: string) {
	return pipe(
		path,
		pathExistsIo,
		TE.fromTaskOption(() => new ErrNoExist(path))
	);
}

export function readDir(
	path: ValidPath | ConfigDir
): TE.TaskEither<ErrGeneric, string[]> {
	return TE.tryCatch(
		() => readdir(path).then(pipe(A.map(ValidPath))),
		liftToErr
	);
}

export function readEnv(env: string): IoO.IOOption<string> {
	return IoO.fromNullable(process.env[env]);
}
