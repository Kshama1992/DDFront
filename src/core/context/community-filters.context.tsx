import React, { useContext, useEffect, useReducer, createContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isSuperAdmin } from '@helpers/user/is-admin.helper';
import dayjs, { extend } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { StringifiableRecord, parse as parseQueryString, stringify as stringifyQueryString } from 'query-string';
import { AuthContext } from './auth.context';

extend(customParseFormat);

interface CommunityFiltersInterface {
	feedCategoryId?: number | null;
	spaceTypeId?: number | null;
	brandId?: number | string;
	venueId?: number | null;
	groupId?: number | null;
	teamLeadId?: number | null;
	createdAtRange?: string[] | null;
	status?: string | null;
	searchString?: string | null;
}

interface CommunityFiltersContextInterface {
	communityFilters: CommunityFiltersInterface;
	setCommunityFilters: ({ type, payload }: { type: string; payload: any }) => any;
}

const CommunityFiltersContext = createContext<CommunityFiltersContextInterface>({} as CommunityFiltersContextInterface);

const initialFilters: CommunityFiltersInterface = {
	spaceTypeId: null,
	brandId: '',
	venueId: null,
	groupId: null,
	teamLeadId: null,
	createdAtRange: [dayjs('01-01-1979', 'MM-DD-YYYY').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
	status: null,
	searchString: '',
};

const reducer = (state: CommunityFiltersInterface, action: { type: string; payload: any }) => {
	switch (action.type) {
		case 'searchString':
		case 'status':
		case 'venueId':
		case 'groupId':
		case 'brandId':
		case 'teamLeadId':
		case 'spaceTypeId':
		case 'feedCategoryId':
		case 'createdAtRange':
			return { ...state, [action.type]: action.payload };
		case 'reset':
			return initialFilters;
		default:
			return initialFilters;
	}
};

function CommunityFiltersProvider(props: any) {
	const { children } = props;
	const navigate = useNavigate();
	const { pathname, search } = useLocation();
	const { authBody } = useContext(AuthContext);

	const parsedQueryParams: CommunityFiltersInterface = { ...initialFilters, ...parseQueryString(search) };

	Object.keys(parsedQueryParams).forEach((pKey) => {
		// @ts-ignore
		if (parsedQueryParams[pKey] === 'true') parsedQueryParams[pKey] = true;
		// @ts-ignore
		if (parsedQueryParams[pKey] === 'false') parsedQueryParams[pKey] = false;
	});

	if (!isSuperAdmin(authBody)) {
		parsedQueryParams.brandId = authBody.brandId;
	}

	const [communityFilters, setCommunityFilters] = useReducer(reducer, parsedQueryParams);

	useEffect(() => {
		const paramsToString = `?${stringifyQueryString(communityFilters as StringifiableRecord)}`;
		if (paramsToString !== search) {
			navigate({ pathname, search: paramsToString });
		}
	}, [communityFilters]);

	const value = { communityFilters, setCommunityFilters };
	return <CommunityFiltersContext.Provider value={value}>{children}</CommunityFiltersContext.Provider>;
}

export { CommunityFiltersContext, CommunityFiltersProvider };
