import { flow, not, pipe } from 'fp-ts/lib/function';
import * as t from 'io-ts';
import { join } from 'path';

const ConfigRecipe = t.intersection([
	t.type({
		name: t.string,
		profile: t.boolean,
	}),
	t.partial({ description: t.string }),
]);

const ConfigSchema = t.intersection([
	t.type({
		name: t.string,
		profile: t.boolean,
	}),
	t.partial({
		extends: t.array(t.string),
		formulae: t.array(ConfigRecipe),
		casks: t.array(ConfigRecipe),
	}),
]);

type Config = t.TypeOf<typeof ConfigSchema>;

export function parseConfig(configDir: ConfigDir) {
	return (a: string): t.Validation<Config> => {
		return pipe(join(configDir, a), ConfigSchema.decode);
	};
}
