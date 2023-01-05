/**
 * original from https://github.com/alexandersmanning/read-more-react/blob/master/source/utils/trimText.js
 */
const PUNCTUATION_LIST = ['.', ',', '!', '?', "'", '{', '}', '(', ')', '[', ']', '/'];

const trimText = (text: string, min = 80, ideal = 100, max = 200) => {
	//This main function uses two pointers to move out from the ideal, to find the first instance of a punctuation mark followed by a space. If one cannot be found, it will go with the first space closest to the ideal.

	if (max < min || ideal > max || ideal < min) {
		throw new Error('The minimum length must be less than the maximum, and the ideal must be between the minimum and maximum.');
	}

	if (text.length < ideal) {
		return [text, ''];
	}

	let pointerOne = ideal;
	let pointerTwo = ideal;
	let firstSpace: number | undefined, resultIdx;

	const spaceMatch = (character: string) => {
		if (character === ' ') {
			return true;
		}
	};

	const setSpace = (idx: number) => {
		if (spaceMatch(text[idx])) {
			firstSpace = firstSpace || idx;
		}
	};

	const punctuationMatch = (idx: number, textI: string) => {
		const punctuationIdx = PUNCTUATION_LIST.indexOf(textI[idx]);
		if (punctuationIdx >= 0 && spaceMatch(textI[idx + 1])) {
			return true;
		}
	};

	const checkMatch = (idx: number, textI: string, maxI: number, minI: number) => {
		if (idx < maxI && idx > minI && punctuationMatch(idx, textI)) {
			return true;
		}
	};

	while (pointerOne < max || pointerTwo > min) {
		if (checkMatch(pointerOne, text, max, min)) {
			resultIdx = pointerOne + 1;
			break;
		} else if (checkMatch(pointerTwo, text, max, min)) {
			resultIdx = pointerTwo + 1;
			break;
		} else {
			setSpace(pointerOne);
			setSpace(pointerTwo);
		}

		pointerOne++;
		pointerTwo--;
	}

	if (resultIdx === undefined) {
		if (firstSpace && firstSpace >= min && firstSpace <= max) {
			resultIdx = firstSpace;
		} else if (ideal - min < max - ideal) {
			resultIdx = min;
		} else {
			resultIdx = max;
		}
	}

	return [text.slice(0, resultIdx), text.slice(resultIdx).trim()];
};

export default trimText;
