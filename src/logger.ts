import type * as IO from 'fp-ts/IO';
import log from 'simple-node-logger';

const infoLogger = log.createSimpleFileLogger('brew.txt');
const debugLogger = log.createSimpleFileLogger('brew.debug.txt');

type Logger = (msg: string) => <A>(arg: A) => IO.IO<A>;

export const info: Logger = (msg) => (arg) => () => {
	infoLogger.info(msg, arg);
	debugLogger.info(msg, arg);
	return arg;
};

export const warn: Logger = (msg) => (arg) => () => {
	infoLogger.warn(msg, arg);
	debugLogger.warn(msg, arg);
	return arg;
};
export const error: Logger = (msg) => (arg) => () => {
	infoLogger.error(msg, arg);
	debugLogger.error(msg, arg);
	return arg;
};
export const debug: Logger = (msg) => (arg) => () => {
	debugLogger.debug(msg, arg);
	return arg;
};
