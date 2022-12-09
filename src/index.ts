import * as C from 'fp-ts/Console';
import * as E from 'fp-ts/Either';
import * as RT from 'fp-ts/ReaderTask';
import { pipe } from 'fp-ts/function';
import * as RIO from 'fp-ts/ReaderIO';
import * as RTE from 'fp-ts/ReaderTaskEither';
import * as TE from 'fp-ts/TaskEither';
import { Command, CommandC } from './schema';
import { env, Env } from './env';

type RawArgs = readonly string[];
type CommandHandler = RTE.ReaderTaskEither<Env, Error, 'ok'>;

const parseArgs: (args: RawArgs) => E.Either<'ignored command', Command> = (args) =>
	pipe(
		CommandC.decode(args[0]),
		E.mapLeft((_) => 'ignored command')
	);

declare const loadUserProfile: RTE.ReaderTaskEither<Env, Error, Profile>;

// const handleInstall: CommandHandler = (env) => pipe(
// 		RTE.Do,
// 		RTE.map((s) => console.log('hi', s)),
// 		RTE.bind('command', () => RTE.fromEither(parseArgs(args))),
// 		// RTE.bind('profile', () => loadUserProfile),
//         RTE.chainW((s) => handleCommand(s.command)),
// 		RTE.fold(
// 			(s) => RT.of(console.log('yay', s)),
// 			(s) => RT.of(console.error('oh no', s))
// 		)
// )(env)

const handleUninstall: CommandHandler = RTE.of('ok');
const handleInstall: CommandHandler = RTE.of('ok');

const intercepts: Record<Command, CommandHandler> = {
	install: handleInstall,
	uninstall: handleUninstall,
} as const;

export default function brew(args: RawArgs): void {
	pipe(
		RTE.fromEither(parseArgs(args)),
		RTE.chainW((cmd) => intercepts[cmd]),
		RTE.match(console.warn, console.log)
	)(env)();
}
