import { useState, useEffect, useRef } from 'react';

export function debounce<F extends (...params: any[]) => any>(fn: F, delay: number) {
	let timeoutID = 0;
	// eslint-disable-next-line func-names
	return function (this: any, ...args: any[]) {
		clearTimeout(timeoutID);
		timeoutID = window.setTimeout(() => fn.apply(this, args), delay);
	} as F;
}

export function useDebounce(value: any, delay: number) {
	// State and setters for debounced value
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(
		() => {
			// Set debouncedValue to value (passed in) after the specified delay
			const handler = setTimeout(() => {
				setDebouncedValue(value);
			}, delay);

			// Return a cleanup function that will be called every time ...
			// ... useEffect is re-called. useEffect will only be re-called ...
			// ... if value changes (see the inputs array below).
			// This is how we prevent debouncedValue from changing if value is ...
			// ... changed within the delay period. Timeout gets cleared and restarted.
			// To put it in context, if the user is typing within our app's ...
			// ... search box, we don't want the debouncedValue to update until ...
			// ... they've stopped typing for more than 500ms.
			return () => {
				clearTimeout(handler);
			};
		},
		// Only re-call effect if value changes
		// You could also add the "delay" var to inputs array if you ...
		// ... need to be able to change that dynamically.
		[value]
	);

	return debouncedValue;
}

export function useDebounceEffect(callback: any, timeout: number, deps: any[]) {
	const timeoutId = useRef();

	useEffect(() => {
		clearTimeout(timeoutId.current);
		// @ts-ignore
		// eslint-disable-next-line @typescript-eslint/no-implied-eval
		timeoutId.current = setTimeout(callback, timeout);

		return () => clearTimeout(timeoutId.current);
	}, deps);
}
