export function bail(msg?: string): never {
	console.log(msg ?? 'something went wrong');
	process.exit(1);
}
