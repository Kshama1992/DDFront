import React, { useContext, useEffect, useReducer, createContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StringifiableRecord, parse as parseQueryString, stringify as stringifyQueryString } from 'query-string';
import dayjs, { extend } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { isSuperAdmin } from '@helpers/user/is-admin.helper';
import ReservationStatus from 'dd-common-blocks/dist/type/ReservationStatus';
import { AuthContext } from './auth.context';

interface ActivityFiltersInterface {
	spaceTypeId?: number | null;
	brandId?: number | null;
	venueId?: number | null;
	spaceId?: number | null;
	status?: ReservationStatus;
	searchString?: string | null;
	processDate?: string;
	reservationDateFrom?: string;
}

interface ActivityFiltersContextInterface {
	activityFilters: ActivityFiltersInterface;
	setActivityFilters: ({ type, payload }: { type: string; payload: any }) => any;
}

const ActivityFiltersContext = createContext<ActivityFiltersContextInterface>({} as ActivityFiltersContextInterface);

extend(customParseFormat);

const initialFilters: ActivityFiltersInterface = {
	spaceTypeId: null,
	brandId: null,
	venueId: null,
	spaceId: null,
	status: undefined,
	searchString: '',
	processDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
	reservationDateFrom: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
};

const reducer = (state: ActivityFiltersInterface, action: { type: string; payload: any }): ActivityFiltersInterface => {
	switch (action.type) {
		case 'status':
		case 'venueId':
		case 'spaceId':
		case 'processDate':
		case 'reservationDateFrom':
		case 'searchString':
		case 'spaceTypeId':
			return { ...state, [action.type]: action.payload };
		case 'brandId':
			return { ...state, [action.type]: action.payload, venueId: null, spaceId: null };

		default:
			return initialFilters;
	}
};

function ActivityFiltersProvider(props: any) {
	const { children } = props;
	const navigate = useNavigate();
	const { pathname, search } = useLocation();
	const { authBody } = useContext(AuthContext);

	const parsedQueryParams: ActivityFiltersInterface = { ...initialFilters, ...parseQueryString(search) };

	Object.keys(parsedQueryParams).forEach((pKey) => {
		// @ts-ignore
		if (parsedQueryParams[pKey] === 'true') parsedQueryParams[pKey] = true;
		// @ts-ignore
		if (parsedQueryParams[pKey] === 'false') parsedQueryParams[pKey] = false;
	});

	if (!isSuperAdmin(authBody)) {
		parsedQueryParams.brandId = authBody.brandId;
	}

	const [activityFilters, setActivityFilters] = useReducer(reducer, parsedQueryParams);

	useEffect(() => {
		const paramsToString = `?${stringifyQueryString(activityFilters as StringifiableRecord)}`;
		if (paramsToString !== search) {
			navigate({ pathname, search: paramsToString });
		}
	}, [activityFilters]);

	const value = { activityFilters, setActivityFilters };
	return <ActivityFiltersContext.Provider value={value}>{children}</ActivityFiltersContext.Provider>;
}

export { ActivityFiltersContext, ActivityFiltersProvider };
