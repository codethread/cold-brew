export function memo0<TRes>(fn: () => TRes): () => TRes {
	let res: TRes;
	return function () {
		if (res) return res;
		res = fn();
		return res;
	};
}

export function memoA<TArg, TRes>(
	fn: (...arg: TArg[]) => TRes
): (...arg: TArg[]) => TRes {
	const cache = new Map();
	return function (...arg) {
		const key = JSON.stringify(arg);
		if (cache.has(key)) return cache.get(key);
		const val = fn(...arg);
		cache.set(key, val);
		return val;
	};
}

export function memo<TArg, TRes>(fn: (arg: TArg) => TRes): (arg: TArg) => TRes {
	const cache = new Map();
	return function (arg) {
		const key = arg;
		if (cache.has(key)) return cache.get(key);
		const val = fn(arg);
		cache.set(key, val);
		return val;
	};
}
