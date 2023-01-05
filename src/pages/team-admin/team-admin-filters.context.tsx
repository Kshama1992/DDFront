import React, { useContext, useEffect, useReducer, createContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StringifiableRecord, parse as parseQueryString, stringify as stringifyQueryString } from 'query-string';
import { AuthContext } from '@context/auth.context';
import { isSuperAdmin } from '@helpers/user/is-admin.helper';

interface TeamAdminFiltersInterface {
	searchString?: string | null;
	brandId?: number | null;
	itemsPerPage?: number | null;
	pageNumber?: number | null;
}

interface TeamAdminFiltersContextInterface {
	teamAdminFilters: TeamAdminFiltersInterface;
	setTeamAdminFilters: ({ type, payload }: { type: string; payload: any }) => any;
}

const TeamAdminFiltersContext = createContext<TeamAdminFiltersContextInterface>({} as TeamAdminFiltersContextInterface);

const initialFilters: TeamAdminFiltersInterface = {
	searchString: '',
	brandId: null,
	itemsPerPage: 5,
	pageNumber: 0,
};

const reducer = (state: TeamAdminFiltersInterface, action: { type: string; payload: any }) => {
	switch (action.type) {
		case 'searchString':
		case 'brandId':
		case 'itemsPerPage':
			return { ...state, [action.type]: action.payload, pageNumber: 0 };
		case 'pageNumber':
			return { ...state, [action.type]: action.payload };
		default:
			return initialFilters;
	}
};

function TeamAdminFiltersProvider(props: any) {
	const { children } = props;
	const navigate = useNavigate();
	const { pathname, search } = useLocation();
	const { authBody } = useContext(AuthContext);

	const parsedQueryParams: TeamAdminFiltersInterface = { ...initialFilters, ...parseQueryString(search) };

	if (!isSuperAdmin(authBody)) {
		parsedQueryParams.brandId = authBody.brandId;
	}

	const [teamAdminFilters, setTeamAdminFilters] = useReducer(reducer, parsedQueryParams);

	useEffect(() => {
		const paramsToString = `?${stringifyQueryString(teamAdminFilters as StringifiableRecord)}`;
		if (paramsToString !== search) {
			navigate({ pathname, search: paramsToString });
		}
	}, [teamAdminFilters]);

	const value = { teamAdminFilters, setTeamAdminFilters };
	return <TeamAdminFiltersContext.Provider value={value}>{children}</TeamAdminFiltersContext.Provider>;
}

export { TeamAdminFiltersContext, TeamAdminFiltersProvider };
