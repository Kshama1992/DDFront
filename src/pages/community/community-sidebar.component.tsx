import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import dayjs from 'dayjs';
import {
	addDays,
	endOfDay,
	startOfDay,
	startOfMonth,
	endOfMonth,
	addMonths,
	startOfWeek,
	endOfWeek,
	isSameDay,
	startOfYear,
	endOfYear,
	addYears,
} from 'date-fns';
import React, { useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { DateRangePicker } from 'react-date-range';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { ListItem, Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import List from '@mui/material/List';
import makeStyles from '@mui/styles/makeStyles';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GroupIcon from '@mui/icons-material/Group';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import UserStatus from 'dd-common-blocks/dist/type/UserStatus';
import { AuthContext } from '@context/auth.context';
import { CommunityFiltersContext } from '@context/community-filters.context';
import checkPermsHelper from '@helpers/checkPerms.helper';
import AutocompleteAsync from '@forms/elements/autocomplete-async.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		membernav: {
			padding: 15,
		},
		itemActive: {
			fontSize: 15,
			backgroundColor: '#efefef',
		},
		item: {
			fontSize: 15,
			'&:hover': {
				backgroundColor: '#efefef',
				'& span': {
					color: theme.palette.primary.main,
				},
			},
		},
		text: {
			'& span': {
				// fontSize: 17
			},
		},
		icon: {
			color: theme.palette.primary.main,
		},
		headTitle: {
			paddingTop: 15,
			paddingLeft: 20,
			marginBottom: 25,
		},
		filterItem: {
			margin: '5px 20px',
		},
		searchField: {
			'& .MuiInputBase-root': {
				background: 'none',
			},
			'& .MuiInput-input': {
				border: 'none',
			},
		},
	})
);

const staticRangeHandler = {
	range: {},
	isSelected(range: any) {
		// @ts-ignore
		const definedRange = this.range();
		return isSameDay(range.startDate, definedRange.startDate) && isSameDay(range.endDate, definedRange.endDate);
	},
};

export function createStaticRanges(ranges: any) {
	return ranges.map((range: any) => ({ ...staticRangeHandler, ...range }));
}

export const defaultStaticRanges = createStaticRanges([
	{
		label: 'Today',
		range: () => ({
			startDate: startOfDay(new Date()),
			endDate: endOfDay(new Date()),
		}),
	},
	{
		label: 'Yesterday',
		range: () => ({
			startDate: startOfDay(addDays(new Date(), -1)),
			endDate: endOfDay(addDays(new Date(), -1)),
		}),
	},

	{
		label: 'This Week',
		range: () => ({
			startDate: startOfWeek(new Date()),
			endDate: endOfWeek(new Date()),
		}),
	},
	{
		label: 'Last Week',
		range: () => ({
			startDate: startOfWeek(addDays(new Date(), -7)),
			endDate: endOfWeek(addDays(new Date(), -7)),
		}),
	},
	{
		label: 'This Month',
		range: () => ({
			startDate: startOfMonth(new Date()),
			endDate: endOfMonth(new Date()),
		}),
	},
	{
		label: 'Last Month',
		range: () => ({
			startDate: startOfMonth(addMonths(new Date(), -1)),
			endDate: endOfMonth(addMonths(new Date(), -1)),
		}),
	},
	{
		label: 'This Year',
		range: () => ({
			startDate: startOfYear(new Date()),
			endDate: endOfYear(new Date()),
		}),
	},
	{
		label: 'Last Year',
		range: () => ({
			startDate: startOfYear(addYears(new Date(), -1)),
			endDate: endOfYear(addYears(new Date(), -1)),
		}),
	},
]);

export function CommunitySidebarFiltersComponent() {
	const classes = useStyles({});

	const [datesVisible, setDatesVisible] = useState(false);
	const [startDate, setStartDate] = useState(new Date('01-01-1979'));
	const [endDate, setEndDate] = useState(new Date());

	// @ts-ignore
	const { type } = useParams();

	const { authBody, isSuperAdmin, isBrandAdmin } = useContext(AuthContext);
	const { communityFilters, setCommunityFilters } = useContext(CommunityFiltersContext);

	const userStatuses: UserStatus[] = Object.values(UserStatus);

	const brandInitialVal = isSuperAdmin ? communityFilters.brandId : authBody?.brandId;

	const setSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCommunityFilters({ type: 'searchString', payload: e.target.value });
	};

	const setCreatedAtRange = (dates: string[]) => {
		setCommunityFilters({ type: 'createdAtRange', payload: dates });
	};

	const setBrandId = (id: number | null) => {
		setCommunityFilters({ type: 'brandId', payload: id || null });
	};

	const handleMyTeam = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCommunityFilters({ type: 'teamLeadId', payload: event.target.checked ? authBody?.id : null });
	};

	const setStatus = (event: SelectChangeEvent) => {
		setCommunityFilters({ type: 'status', payload: (event.target.value as string) || null });
	};

	const onDatesChange = ({ range1 }: any) => {
		setStartDate(range1.startDate);
		setEndDate(range1.endDate);
		setDatesVisible(false);
		setCreatedAtRange([dayjs(range1.startDate).format('YYYY-MM-DD'), dayjs(range1.endDate).format('YYYY-MM-DD')]);
	};

	return (
		<>
			<Typography className={classes.headTitle}>FILTER BY</Typography>
			<Grid container spacing={0} style={{ paddingBottom: 15 }}>
				<Grid item xs={12} className={classes.filterItem}>
					<TextField
						fullWidth
						label="Search"
						variant="standard"
						value={communityFilters.searchString || ''}
						className={classes.searchField}
						onChange={setSearch}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						}}
					/>
				</Grid>

				{isSuperAdmin && (
					<Grid item xs={12} className={classes.filterItem}>
						<AutocompleteAsync
							type="brand"
							label="Brand"
							variant="standard"
							showAll
							filter={{}}
							shrink={false}
							defaultValue={Number(brandInitialVal)}
							onChange={setBrandId}
						/>
					</Grid>
				)}

				{type === 'members' && (
					<>
						<Grid item xs={12} className={classes.filterItem}>
							{(isBrandAdmin || isSuperAdmin) && (
								<FormControl fullWidth variant="standard">
									<InputLabel id="select-status">Status</InputLabel>
									<Select
										labelId="select-status"
										value={communityFilters && communityFilters?.status ? communityFilters.status : ''}
										onChange={setStatus}
									>
										{userStatuses.map((i: UserStatus) => (
											<MenuItem value={i} key={i}>
												{i}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							)}

							{authBody?.leadingTeams && authBody?.leadingTeams.length > 0 && (
								<FormControl fullWidth>
									<FormControlLabel control={<Switch onChange={handleMyTeam} color="primary" />} label="My team" />
								</FormControl>
							)}
						</Grid>

						<Grid item xs={12} className={classes.filterItem}>
							<br />
							<InputLabel shrink htmlFor="dateCreated">
								Member joined date
							</InputLabel>

							<Button
								id="dateCreated"
								onClick={() => setDatesVisible(!datesVisible)}
								style={{ backgroundColor: '#fff', padding: '10px 0', fontWeight: 300, fontSize: 17 }}
							>
								{dayjs(startDate).format('MM-DD-YY')} - {dayjs(endDate).format('MM-DD-YY')}
								{/* {format(startDate, 'DD/MM/YY')} - {format(endDate, 'dd/MM/yy')} */}
							</Button>

							<Divider style={{ backgroundColor: 'rgba(0, 0, 0, 0.42)' }} />
						</Grid>
					</>
				)}
			</Grid>

			<Dialog open={datesVisible} maxWidth="md" onClose={() => setDatesVisible(false)}>
				<DialogContent>
					<DateRangePicker
						onChange={onDatesChange}
						moveRangeOnFirstSelection={false}
						months={2}
						ranges={[{ startDate, endDate }]}
						direction="horizontal"
						rangeColors={['#000']}
						staticRanges={defaultStaticRanges}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
}

export function CommunitySidebarBaseComponent({ activeType }: { activeType?: 'feeds' | 'members' | 'companies' | 'groups' | 'events' }) {
	const classes = useStyles({});
	// @ts-ignore
	const { type } = useParams();

	const { authBody, isBrandAdmin, isSuperAdmin } = useContext(AuthContext);

	const isAdmin = isBrandAdmin || isSuperAdmin;

	return (
		<>
			<Typography className={classes.headTitle}>YOUR COMMUNITY</Typography>
			<List className={classes.membernav}>
				{checkPermsHelper(['Customer Feeds'], ['Feeds'], authBody) && (
					<ListItem
						component={Link}
						to={`${isAdmin ? '/dashboard' : ''}/community/feeds`}
						className={activeType === 'feeds' || type === 'feeds' ? classes.itemActive : classes.item}
					>
						<ListItemIcon>
							<MessageIcon className={classes.icon} />
						</ListItemIcon>
						<ListItemText primary="Feeds" className={classes.text} />
					</ListItem>
				)}

				{checkPermsHelper(['Enable Member Tab'], ['Community Members'], authBody) && (
					<ListItem
						component={Link}
						to={`${isAdmin ? '/dashboard' : ''}/community/members`}
						className={activeType === 'members' || type === 'members' ? classes.itemActive : classes.item}
					>
						<ListItemIcon>
							<PersonIcon className={classes.icon} />
						</ListItemIcon>
						<ListItemText primary="Members" className={classes.text} />
					</ListItem>
				)}

				{checkPermsHelper(['Enable Company Tab'], ['Community Companies'], authBody) && (
					<ListItem
						component={Link}
						to={`${isAdmin ? '/dashboard' : ''}/community/companies`}
						className={activeType === 'companies' || type === 'companies' ? classes.itemActive : classes.item}
					>
						<ListItemIcon>
							<BusinessCenterIcon className={classes.icon} />
						</ListItemIcon>
						<ListItemText primary="Companies" className={classes.text} />
					</ListItem>
				)}

				{checkPermsHelper(['Enable Group Tab'], ['Community Groups'], authBody) && (
					<ListItem
						component={Link}
						to={`${isAdmin ? '/dashboard' : ''}/community/groups`}
						className={activeType === 'groups' || type === 'groups' ? classes.itemActive : classes.item}
					>
						<ListItemIcon>
							<GroupIcon className={classes.icon} />
						</ListItemIcon>
						<ListItemText primary="Groups" className={classes.text} />
					</ListItem>
				)}

				{checkPermsHelper(['Customer Events'], [], authBody) && (
					<ListItem
						component={Link}
						to={`${isAdmin ? '/dashboard' : ''}/community/events`}
						className={activeType === 'events' || type === 'events' ? classes.itemActive : classes.item}
					>
						<ListItemIcon>
							<CalendarTodayIcon className={classes.icon} />
						</ListItemIcon>
						<ListItemText primary="Events" className={classes.text} />
					</ListItem>
				)}
			</List>
		</>
	);
}

export function CommunitySidebarSingleItemComponent({ activeType }: { activeType?: 'feeds' | 'members' | 'companies' | 'groups' | 'events' }) {
	return (
		<Paper>
			<CommunitySidebarBaseComponent activeType={activeType} />
		</Paper>
	);
}

export function CommunitySidebarComponent({ activeType }: { activeType?: 'feeds' | 'members' | 'companies' | 'groups' | 'events' }) {
	const { isSuperAdmin, isBrandAdmin, authBody } = useContext(AuthContext);

	return (
		<Paper>
			<CommunitySidebarBaseComponent activeType={activeType} />
			{(isBrandAdmin || isSuperAdmin || (authBody?.leadingTeams && authBody?.leadingTeams.length > 0)) && <CommunitySidebarFiltersComponent />}
		</Paper>
	);
}
