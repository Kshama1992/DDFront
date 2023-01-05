import React, { useEffect, useReducer, createContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StringifiableRecord, parse as parseQueryString, stringify as stringifyQueryString } from 'query-string';

interface BrandFiltersInterface {
	searchString?: string | null;
	domain?: string | null;
}

interface BrandFiltersContextInterface {
	brandFilters: BrandFiltersInterface;
	setBrandFilters: ({ type, payload }: { type: string; payload: any }) => any;
}

const BrandFiltersContext = createContext<BrandFiltersContextInterface>({} as BrandFiltersContextInterface);

const initialFilters: BrandFiltersInterface = {
	searchString: '',
	domain: '',
};

const reducer = (state: BrandFiltersInterface, action: { type: string; payload: any }) => {
	switch (action.type) {
		case 'searchString':
		case 'domain':
			return { ...state, [action.type]: action.payload };
		default:
			return initialFilters;
	}
};

function BrandFiltersProvider(props: any) {
	const { children } = props;
	const navigate = useNavigate();
	const { pathname, search } = useLocation();

	const parsedQueryParams: BrandFiltersInterface = { ...initialFilters, ...parseQueryString(search) };

	const [brandFilters, setBrandFilters] = useReducer(reducer, parsedQueryParams);

	useEffect(() => {
		const paramsToString = `?${stringifyQueryString(brandFilters as StringifiableRecord)}`;
		if (paramsToString !== search) {
			navigate({ pathname, search: paramsToString });
		}
	}, [brandFilters]);

	const value = { brandFilters, setBrandFilters };
	return <BrandFiltersContext.Provider value={value}>{children}</BrandFiltersContext.Provider>;
}

export { BrandFiltersContext, BrandFiltersProvider };
