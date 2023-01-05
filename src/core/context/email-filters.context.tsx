import React, { useContext, useEffect, useReducer, createContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isSuperAdmin } from '@helpers/user/is-admin.helper';
import { StringifiableRecord, parse as parseQueryString, stringify as stringifyQueryString } from 'query-string';
import { AuthContext } from './auth.context';

interface EmailFiltersInterface {
	searchString?: string | null;
	brandId?: number | null;
	emailTemplateTypeId?: number | null;
}

interface EmailFiltersContextInterface {
	emailFilters: EmailFiltersInterface;
	setEmailFilters: ({ type, payload }: { type: string; payload: any }) => any;
}

const EmailFiltersContext = createContext<EmailFiltersContextInterface>({} as EmailFiltersContextInterface);

const initialFilters: EmailFiltersInterface = {
	searchString: '',
	brandId: null,
	emailTemplateTypeId: null,
};

const reducer = (state: EmailFiltersInterface, action: { type: string; payload: any }) => {
	switch (action.type) {
		case 'searchString':
		case 'emailTemplateTypeId':
		case 'brandId':
			return { ...state, [action.type]: action.payload };
		default:
			return initialFilters;
	}
};

function EmailFiltersProvider(props: any) {
	const { children } = props;
	const navigate = useNavigate();
	const { pathname, search } = useLocation();
	const { authBody } = useContext(AuthContext);

	const parsedQueryParams: EmailFiltersInterface = { ...initialFilters, ...parseQueryString(search) };

	if (!isSuperAdmin(authBody)) {
		parsedQueryParams.brandId = authBody.brandId;
	}

	const [emailFilters, setEmailFilters] = useReducer(reducer, parsedQueryParams);

	useEffect(() => {
		const paramsToString = `?${stringifyQueryString(emailFilters as StringifiableRecord)}`;
		if (paramsToString !== search) {
			navigate({ pathname, search: paramsToString });
		}
	}, [emailFilters]);

	const value = { emailFilters, setEmailFilters };
	return <EmailFiltersContext.Provider value={value}>{children}</EmailFiltersContext.Provider>;
}

export { EmailFiltersContext, EmailFiltersProvider };
