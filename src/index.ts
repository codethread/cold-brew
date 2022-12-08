// tasks
// 1. get brew commands to pass through
// 2. get output to display
// 3. colors and stuff
// 4. handle input mid command
// 5. exit codes
// 6. add custom steps
// 8. disable auto update things?? on update command, run volta-migrate
import { SystemClock } from 'clock-ts';
import * as TE from 'fp-ts/TaskEither';
import * as RIO from 'fp-ts/ReaderIO';
import * as IO from 'fp-ts/IO';
import type * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import * as C from 'fp-ts/Console';
import * as L from 'logger-fp-ts';

const env: L.LoggerEnv = {
	clock: SystemClock,
	logger: pipe(C.log, L.withShow(L.ShowLogEntry)),
};

type RawArgs = readonly string[];

function shimBrewOrPassthrough(args: RawArgs): TE.TaskEither<string, string> {
	return TE.of('hi');
}

declare function printResult(res: string): IO.IO<void>;

export default function brew(args: RawArgs): void {
	pipe(
		RIO.of({ result: 'Result of an action' }),
		RIO.chainFirst(() => L.info('Some action was performed')),
		RIO.chainFirst(L.debugP("And here's the details"))
	)(env)();

	// pipe(
	// 	args,
	// 	TE.fromIO(info('started with args')),
	// 	(s) => s,
	// 	TE.map((s) => shimBrewOrPassthrough(s)),
	// 	(s) => s,
	// 	TE.fold(
	// 		(e) => {
	// 			IO.of();
	// 			error('left')(e);
	// 			return T.of('hi');
	// 		},
	// 		(e) => {
	// 			error('right')(e);
	// 			return T.of('hi');
	// 		}
	// 	)
	// )();

	// (intercepts[args[0] ?? ''] ?? noop)(args);
}
