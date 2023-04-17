import { ErrGeneric } from './errors';
import { match, P } from 'ts-pattern';

export function assertIsNodeError(
	e: unknown
): asserts e is NodeJS.ErrnoException {
	if (typeof e === 'object' && e !== null && e instanceof Error && 'code' in e)
		return undefined;
	throw e;
}

export function liftToErr(e: unknown): ErrGeneric {
	return match(e)
		.with({ message: P.string, name: P.string }, (e) => e)
		.otherwise(() => new ErrGeneric(JSON.stringify(e)));
}
