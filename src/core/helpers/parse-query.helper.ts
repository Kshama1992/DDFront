import { parse as parseQueryString } from 'query-string';

// eslint-disable-next-line import/prefer-default-export
export const parseQueryHelper = (searchString: string): any => {
	const query = parseQueryString(searchString, { arrayFormat: 'index' });

	Object.keys(query).forEach((pKey) => {
		// @ts-ignore
		if (query[pKey] === 'true') query[pKey] = true;
		// @ts-ignore
		if (query[pKey] === 'false') query[pKey] = false;
	});

	return query;
};
