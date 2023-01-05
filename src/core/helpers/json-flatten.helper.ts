export default function JSONflatten(data: any): any {
	const result = {};
	function recurse(cur: string | any[], prop: string) {
		if (Object(cur) !== cur) {
			// @ts-ignore
			result[prop] = cur;
		} else if (Array.isArray(cur)) {
			for (let i = 0, l = cur.length; i < l; i++) recurse(cur[i], prop + '[' + i + ']');
			if (cur.length == 0) {
				// @ts-ignore
				result[prop] = [];
			}
		} else {
			let isEmpty = true;
			// @ts-ignore
			for (const p in cur) {
				isEmpty = false;
				recurse(cur[p], prop ? prop + '.' + p : p);
			}
			if (isEmpty && prop) {
				// @ts-ignore
				result[prop] = {};
			}
		}
	}
	recurse(data, '');
	return result;
}
