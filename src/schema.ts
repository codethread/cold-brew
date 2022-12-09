import * as t from 'io-ts';

export const CommandC = t.union([t.literal('install'), t.literal('uninstall')]);

export type Command = t.TypeOf<typeof CommandC>;
