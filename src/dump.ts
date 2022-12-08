// prevent gc
let brewProc: ChildProcess;

type Command = (args: string[]) => void;
const noop: Command = (args: string[]) => {
	brewProc = spawn(getBrewBin(), args, {
		stdio: 'inherit',
		env: {},
	});

	brewProc.on('exit', (code) => {
		info('finished');
		process.exit(code ?? 0);
	});
};

type Collection = {
	/** identify the collection, allows extension */
	name: string;

	/** list any other collections this collection includes */
	extends?: string[];

	/** an optional list of brew formulae this colleciton includes */
	formulae?: string[];

	/** an optional list of brew casks this colleciton includes */
	casks?: string[];
};

function not<A>(pred: A | undefined | null): pred is A {
	return !pred;
}

// function makeIfNoExists(dir: string) {
//     if (not(existsSync(dir))) mkdirSync(dir, { recursive: true })
// }

function getCollection(profile: string): Collection | null {
	const dir = join(homedir(), '.config/cold-brew');
	debug('config directory ', dir);

	if (not(existsSync(dir))) {
		warn('no cold-brew config');
		return null;
	}

	const collectionFile = `${dir}/${profile}.json`;
	debug(collectionFile);

	if (not(existsSync(collectionFile))) {
		warn('no cold-brew config file ', profile);
		return null;
	}

	const file = readFileSync(collectionFile, { encoding: 'utf-8' });
	try {
		return JSON.parse(file);
	} catch (e) {
		error(e);
		return null;
	}
}

/** list all Collections */
const collections: Command = () => {
	const profile = process.env['COLD_BREW_PROFILE'];

	if (not(profile)) {
		warn('no profile set, please use COLD_BREW_PROFILE');
	}

	const config = getCollection(profile);
	console.table(config);
};

const intercepts: Record<string, Command> = {
	install: noop,
	uninstall: noop,
	collections,
};

// TODO
function getBrewBin(): string {
	// const brew = '/usr/local/bin/brew';
	const brewBin = '/opt/homebrew/bin/brew';
	return brewBin;
}
