// Yield all int in [start, end) or [0, start) if end is not defined
export function* range(start: number, end?: number) {
	if (end === undefined) {
		end = start;
		start = 0;
	}

	for (let i = start; i < end; ++i) {
		yield i;
	}
}
