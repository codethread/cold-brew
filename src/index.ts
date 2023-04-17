// tasks
// 1. get brew commands to pass through
// 2. get output to display
// 3. colors and stuff
// 4. handle input mid command
// 5. exit codes
// 6. add custom steps
//

import { spawn } from 'child_process';

import { match, P } from 'ts-pattern';
import { bail } from './bail';
import { generate } from './generate';
import { install } from './install';

// const brew = '/usr/local/bin/brew';
// const logPath = join(__dirname, "../log.txt");

export default function greet(args: readonly string[]) {
	match(args)
		.with(P.nullish, [], () => bail('please pass a command'))
		.with(['generate'], () => generate())
		.with(['install'], () => bail('choose a package'))
		.with(['install', P.string], ([, pack]) => install(pack))
		.with(['uninstall'], () => bail('choose a package'))
		.with(['uninstall', P.string], ([, pack]) => uninstall(pack))
		.otherwise(() => bail('please pass an argument'));
}

function uninstall(brewPackage: string) {
	return console.log('uninstall');
}

function passthrough(args: string[]) {
	const proc = spawn('brew', args, { shell: '/bin/zsh', stdio: 'inherit' });

	// proc.stdout.on("data", (b) => {
	//   writeFile(logPath, b.toString(), (e) => {
	//     console.error(e);
	//   });
	// });
	// process.stdin.pipe(proc.stdin);
	// proc.stdout.pipe(process.stdout);
	// proc.stderr.pipe(process.stderr);

	proc.on('exit', process.exit);
}
