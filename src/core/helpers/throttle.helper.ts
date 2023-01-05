export default function throttle(fn: any, threshhold = 250) {
	let last: number, deferTimer: any;
	return function () {
		// @ts-ignore
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const context = this;

		const now = +new Date(),
			// @ts-ignore
			// eslint-disable-next-line prefer-rest-params
			args = arguments;
		if (last && now < last + threshhold) {
			// hold on to it
			clearTimeout(deferTimer);
			deferTimer = setTimeout(function () {
				last = now;
				fn.apply(context, args);
			}, threshhold);
		} else {
			last = now;
			fn.apply(context, args);
		}
	};
}
