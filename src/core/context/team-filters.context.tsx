import React, { useContext, useEffect, useReducer, useState, createContext, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StringifiableRecord, parse as parseQueryString, stringify as stringifyQueryString } from 'query-string';
import TeamInterface from 'dd-common-blocks/dist/interface/team.interface';
import ReservationInterface from 'dd-common-blocks/dist/interface/reservation.interface';
import TeamMemberInterface from 'dd-common-blocks/dist/interface/team-member.interface';
import TeamService from '@service/team.service';
import { isSuperAdmin } from '@helpers/user/is-admin.helper';
import ReservationService from '@service/reservation.service';
import { AuthContext } from './auth.context';

interface TeamFiltersInterface {
	searchString?: string | null;
	brandId?: number | null;
	teamLeadId?: number | null;
	dateFrom?: string;
}

interface TeamActivityFiltersInterface {
	teamId?: number | null;
	dateFrom?: string;
}

interface DefaultContext {
	loadTeams: () => void;
	loadActivities: () => void;
	setFilters: ({ type, payload }: { type: string; payload: any }) => any;
	filters: TeamFiltersInterface;
	setActivityFilters: ({ type, payload }: { type: string; payload: any }) => any;
	activityFilters: TeamActivityFiltersInterface;
	leadingTeams: TeamInterface[];
	activities: ReservationInterface[];
}

const TeamFiltersContext = createContext<DefaultContext>({} as DefaultContext);

const initialFilters: TeamFiltersInterface = {
	searchString: '',
	brandId: null,
	teamLeadId: null,
};

const reducer = (state: TeamFiltersInterface, action: { type: string; payload: any }) => {
	switch (action.type) {
		case 'searchString':
		case 'teamLeadId':
		case 'brandId':
			return { ...state, [action.type]: action.payload };
		default:
			return initialFilters;
	}
};

const activityReducer = (state: TeamFiltersInterface, action: { type: string; payload: any }) => {
	switch (action.type) {
		case 'dateFrom':
			return { ...state, [action.type]: action.payload };
		default:
			return initialFilters;
	}
};

function TeamFiltersProvider(props: any) {
	const teamService = new TeamService();
	const reservationService = new ReservationService();

	const { children } = props;
	const navigate = useNavigate();
	const { pathname, search } = useLocation();
	const { authBody, isBrandAdmin } = useContext(AuthContext);

	const parsedQueryParams: TeamFiltersInterface = { ...initialFilters, ...parseQueryString(search) };

	if (!isSuperAdmin(authBody)) {
		parsedQueryParams.brandId = authBody.brandId;
	}

	const [filters, setFilters] = useReducer(reducer, parsedQueryParams);
	const [activityFilters, setActivityFilters] = useReducer(activityReducer, {});

	const [leadingTeams, setLeadingTeams] = useState<TeamInterface[]>([]);
	const [activities, setActivities] = useState<ReservationInterface[]>([]);

	const loadTeams = useCallback(async () => {
		try {
			const params: any = {};
			if (!isBrandAdmin && !isSuperAdmin(authBody)) params.teamLeadId = authBody?.id;
			if (isBrandAdmin) {
				params.brandId = authBody?.brandId;
			}
			const [loadedTeams] = await teamService.list({ ...params, limit: 130 });
			setLeadingTeams(loadedTeams);
		} catch (e) {
			console.error(e);
		}
	}, []);

	const loadActivities = useCallback(async () => {
		try {
			const [loadedActs] = await reservationService.list({ limit: 10 });
			setActivities(loadedActs);
		} catch (e) {
			console.error(e);
		}
	}, []);

	useEffect(() => {
		if (authBody?.leadingTeams && authBody?.leadingTeams.length > 0) loadTeams().then();
		else if (authBody?.teamMembership) setLeadingTeams(authBody?.teamMembership.map((tm: TeamMemberInterface) => tm.team!) || []);
	}, []);

	useEffect(() => {
		const paramsToString = `?${stringifyQueryString(filters as StringifiableRecord)}`;
		if (paramsToString !== search) {
			navigate({ pathname, search: paramsToString });
		}
	}, [filters]);

	const value = { filters, setFilters, leadingTeams, loadTeams, activityFilters, setActivityFilters, loadActivities, activities };
	return <TeamFiltersContext.Provider value={value}>{children}</TeamFiltersContext.Provider>;
}

export { TeamFiltersContext, TeamFiltersProvider };
