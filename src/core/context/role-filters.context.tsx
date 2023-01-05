import React, { useContext, useEffect, useReducer, createContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isSuperAdmin } from '@helpers/user/is-admin.helper';
import { StringifiableRecord, parse as parseQueryString, stringify as stringifyQueryString } from 'query-string';
import { AuthContext } from './auth.context';

interface RoleFiltersInterface {
	searchString?: string | null;
	brandId?: number | null;
}

interface RoleFiltersContextInterface {
	roleFilters: RoleFiltersInterface;
	setRoleFilters: ({ type, payload }: { type: string; payload: any }) => any;
}

const RoleFiltersContext = createContext<RoleFiltersContextInterface>({} as RoleFiltersContextInterface);

const initialFilters: RoleFiltersInterface = {
	searchString: '',
	brandId: null,
};

const reducer = (state: RoleFiltersInterface, action: { type: string; payload: any }) => {
	switch (action.type) {
		case 'searchString':
		case 'brandId':
			return { ...state, [action.type]: action.payload };
		default:
			return initialFilters;
	}
};

function RoleFiltersProvider(props: any) {
	const { children } = props;
	const navigate = useNavigate();
	const { pathname, search } = useLocation();
	const { authBody } = useContext(AuthContext);

	const parsedQueryParams: RoleFiltersInterface = { ...initialFilters, ...parseQueryString(search) };

	if (!isSuperAdmin(authBody)) {
		parsedQueryParams.brandId = authBody.brandId;
	}

	const [roleFilters, setRoleFilters] = useReducer(reducer, parsedQueryParams);

	useEffect(() => {
		const paramsToString = `?${stringifyQueryString(roleFilters as StringifiableRecord)}`;
		if (paramsToString !== search) {
			navigate({ pathname, search: paramsToString });
		}
	}, [roleFilters]);

	const value = { roleFilters, setRoleFilters };
	return <RoleFiltersContext.Provider value={value}>{children}</RoleFiltersContext.Provider>;
}

export { RoleFiltersContext, RoleFiltersProvider };
