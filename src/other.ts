import * as T from 'fp-ts/Task';
import * as IO from 'fp-ts/IO';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import * as RT from 'fp-ts/ReaderTask';
import * as RTE from 'fp-ts/ReaderTaskEither';
import * as R from 'fp-ts/Reader';
import { pipe } from 'fp-ts/function';

type Env = {
    name: string;
    age: number;
};

const log = (msg?: string) => <A = any>(p: A) => console.log(msg, p);

/** _______________________________________________________________________________________________ 
--- READER
___________________________________________________________________________________________________ */
const getYearsTillPension = (retirementAge: number): R.Reader<Env, number> => ({ age }) => retirementAge - age;
const nameCensored = (replacements: RegExp): R.Reader<Env, string> => ({ name }) => name.replace(replacements, '*');
type Output = {
    pension: number,
    censored: string;
}

function handleReader() {
    pipe(
        R.Do,
        R.bind('pension', () => R.asks(getYearsTillPension(80))),
        R.bind('censored', () => R.asks(nameCensored(/o/g))),
        R.map(log('Reader'))
    )({ age: 11, name: 'Bob' })
}

handleReader();

/** _______________________________________________________________________________________________ 
--- Task
___________________________________________________________________________________________________ */
const getYearsTillPensionTask = (age: number): T.Task<number> => T.of(60 - age)
const nameCensoredTask = (name: string): T.Task<string> => T.of(name.replaceAll(/o/g, '*'))

function handleTask() {
    pipe(
        T.Do,
        T.bind('pension', () => getYearsTillPensionTask(23)),
        T.bind('censored', () => nameCensoredTask('Bob')),
        T.map(log('Task'))
    )()
}

handleTask()

/** _______________________________________________________________________________________________ 
--- TaskEither
___________________________________________________________________________________________________ */
const getYearsTillPensionTE = (age: number): TE.TaskEither<string, number> => TE.of(60 - age)
// const nameCensoredTE = (name: string): TE.TaskEither<string, string> => TE.of(name.replaceAll(/a/g, '*'))
const nameCensoredTE = (name: string): TE.TaskEither<string, string> => TE.left('oh dear!')

function handleTaskEither() {
    pipe(
        TE.Do,
        TE.bind('pension', () => getYearsTillPensionTE(23)),
        TE.bind('censored', () => nameCensoredTE('Bob')),
        TE.map(log('TaskEither')),
        TE.mapLeft(log('TaskEither failed'))
    )()
}
handleTaskEither()
/** _______________________________________________________________________________________________ 
--- READER Task
___________________________________________________________________________________________________ */
type ServiceEnv = {
    ageService: T.Task<number>;
    censorService: T.Task<string[]>;
}

const getYearsTillPensionT = (age: number): RT.ReaderTask<ServiceEnv, number> => ({ ageService }) => pipe(
    ageService,
    T.map(retirementAge => retirementAge - age)
)

const nameCensoredT = (name: string): RT.ReaderTask<ServiceEnv, string> => ({ censorService }) => pipe(
    censorService,
    T.map(censoredChars => name.replaceAll(new RegExp(`[${censoredChars.join('')}]`, 'g'), '*'))
)

const Services: ServiceEnv = {
    censorService: async () => ['o', 'v'], ageService: async () => 66
}

function handleReaderTask() {
    pipe(
        RT.Do,
        RT.bind('pension', () => getYearsTillPensionT(23)),
        RT.bind('censored', () => nameCensoredT('Bob')),
        RT.map(log('ReaderTask'))
    )(Services)()
}

handleReaderTask()

/** _______________________________________________________________________________________________ 
--- READER Task Either
___________________________________________________________________________________________________ */
type ServicesEnv = {
    ageService: TE.TaskEither<string, number>;
    censorService: TE.TaskEither<string, string[]>;
}

const getYearsTillPensionRTE = (age: number): RTE.ReaderTaskEither<ServicesEnv, string, number> => ({ ageService }) => pipe(
    ageService,
    TE.map(retirementAge => retirementAge - age)
)

const nameCensoredRTE = (name: string): RTE.ReaderTaskEither<ServicesEnv, string, string> => ({ censorService }) => pipe(
    censorService,
    TE.map(censoredChars => name.replaceAll(new RegExp(`[${censoredChars.join('')}]`, 'g'), '*'))
)

const ServicesEither: ServicesEnv = {
    // censorService: async () => E.of(['o', 'v']),
    censorService: async () => E.left('oh no!'),
    ageService: async () => E.of(66)
}

function handleReaderTaskEither() {
    pipe(
        RTE.Do,
        RTE.bind('pension', () => getYearsTillPensionRTE(23)),
        RTE.bind('censored', () => nameCensoredRTE('Bob')),
        // RTE.map(log('ReaderTaskEither')),
        // RTE.mapLeft(log('ReaderTaskEither fail'))
        RTE.fold(
            // (s) => RT.of(null),
            (s) => RT.of(log('RTE fail')(s)), // TODO: how do pointfree?
            (y) => RT.of(log('RTE')(y))
        )
    )(ServicesEither)()
}

handleReaderTaskEither()
