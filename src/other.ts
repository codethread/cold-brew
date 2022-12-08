import * as IO from 'fp-ts/IO';
import * as T from 'fp-ts/ReaderTask';
import { pipe } from 'fp-ts/function';

const s =
	(m: any): IO.IO<string> =>
	() => {
		console.log('io called with', m);
		return 'io done';
	};

type Env = {
	name: string;
};

const task = (): T.ReaderTask<Env, string> => (env) => async () => {
	console.log('env is runnign');
	return env.name;
};

function handle() {
	pipe(
		T.Do,
		T.ask<Env>,
		T.bind('hi', (s) => {
			console.log('called layer 1');
			return () => {
				console.log('called layer 2');
				return async () => 'hello' + s.name;
			};
		}),
		T.chainFirst(({ hi }) => {
			console.log('in chain');
			return T.of(null);
		}),
		T.map((res) => console.log(res))
	)({ name: 'dave' });
}

handle();
