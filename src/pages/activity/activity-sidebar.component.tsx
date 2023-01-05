import dayjs, { extend } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import { AuthContext } from '@context/auth.context';
import { ActivityFiltersContext } from '@context/activity-filters.context';
import SpaceTypeService from '@service/space-type.service';
import AutocompleteAsync from '@forms/elements/autocomplete-async.component';
import BrandFilter from 'dd-common-blocks/dist/interface/filter/brand-filter.interface';
import VenueFilter from 'dd-common-blocks/dist/interface/filter/venue-filter.interface';
import SpaceFilter from 'dd-common-blocks/dist/interface/filter/space-filter.interface';

extend(customParseFormat);

const useStyles = makeStyles(() =>
	createStyles({
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
		formControl: {
			width: '100%',
		},
		accDetails: {
			padding: 0,
			borderTop: '1px solid #d5d5d5',
		},
	})
);

export default function ActivitySidebarFiltersComponent() {
	const classes = useStyles({});
	const spaceTypeService = new SpaceTypeService();

	const theme = useTheme();
	const isPhone = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

	const { isSuperAdmin } = useContext(AuthContext);
	const { activityFilters, setActivityFilters } = useContext(ActivityFiltersContext);

	const [expanded, setExpanded] = useState<boolean>(!isPhone);

	const [spaceTypeList, setSpaceTypeList] = useState<SpaceTypeInterface[]>([]);
	const [selectedDate, setSelectedDate] = useState<Date | null>(dayjs(activityFilters.processDate, 'YYYY-MM-DD').toDate() || new Date());
	const [hoursFrom, setHoursFrom] = useState<Date | null>(dayjs(activityFilters.reservationDateFrom, 'YYYY-MM-DD').toDate() || new Date());

	const handleExpand = () => {
		setExpanded(isPhone ? !expanded : true);
	};

	const handleDateChange = (date: Date | null) => {
		if (date) setSelectedDate(date);
		setActivityFilters({ type: 'processDate', payload: date ? dayjs(date).format('YYYY-MM-DD') : '' });
	};

	const handleHoursFromChange = (date: Date | null) => {
		if (date) setHoursFrom(date);
		setActivityFilters({ type: 'reservationDateFrom', payload: date ? dayjs(date).format('YYYY-MM-DD') : '' });
	};

	const setBrandId = (id: number | null) => {
		setActivityFilters({ type: 'brandId', payload: id || null });
	};

	const setVenueId = (id: number | null | undefined) => {
		if (typeof id === 'undefined') return;
		setActivityFilters({ type: 'venueId', payload: id || null });
	};

	const setSpaceId = (id: number | null | undefined) => {
		if (typeof id === 'undefined') return;
		setActivityFilters({ type: 'spaceId', payload: id || null });
	};

	const setSpaceTypeId = (event: any) => {
		setActivityFilters({ type: 'spaceTypeId', payload: event.target.value });
	};

	const loadSpaceTypes = useCallback(async () => {
		const [spaceTypes] = await spaceTypeService.list({ withCache: true, onlyChildren: true });
		setSpaceTypeList(spaceTypes);
	}, [activityFilters]);

	useEffect(() => {
		loadSpaceTypes().then();
	}, [activityFilters.brandId]);

	const onSpaceChange = (v: number | null) => {
		setSpaceId(v);
	};

	const onVenueChange = (v: number | null) => {
		setVenueId(v);
	};

	return (
		<Paper>
			<Accordion expanded={expanded} onChange={handleExpand}>
				<AccordionSummary expandIcon={isPhone ? <ExpandMoreIcon /> : ''}>
					<Typography>FILTER BY</Typography>
				</AccordionSummary>
				<AccordionDetails className={classes.accDetails}>
					<Grid container spacing={0} style={{ paddingBottom: 15 }}>
						{isSuperAdmin && (
							<Grid item xs={12} className={classes.filterItem}>
								<AutocompleteAsync
									type="brand"
									showAll
									label="Brand"
									shrink={false}
									variant="standard"
									filter={{ includeIds: activityFilters.brandId ? [activityFilters.brandId] : [] } as BrandFilter}
									defaultValue={Number(activityFilters.brandId)}
									onChange={setBrandId}
								/>
							</Grid>
						)}

						<Grid item xs={12} className={classes.filterItem}>
							<AutocompleteAsync
								type="venue"
								label="Venue"
								onChange={onVenueChange}
								variant="standard"
								shrink={false}
								defaultValue={activityFilters.venueId}
								filter={{ brandId: activityFilters.brandId } as VenueFilter}
							/>
						</Grid>

						<Grid item xs={12} className={classes.filterItem}>
							<AutocompleteAsync
								type="space"
								filter={
									{
										withBrand: false,
										withVenue: false,
										withSpaceType: false,
										withPhotos: false,
										brandId: activityFilters.brandId,
										venueId: activityFilters.venueId,
									} as SpaceFilter
								}
								onChange={onSpaceChange}
								variant="standard"
								shrink={false}
								defaultValue={activityFilters.spaceId}
							/>
						</Grid>

						<Grid item xs={12} className={classes.filterItem}>
							<FormControl variant="standard" fullWidth>
								<InputLabel id="select-space-type-label">Space Type</InputLabel>
								<Select
									placeholder="Please select"
									labelId="select-space-type-label"
									defaultValue={Number(activityFilters.spaceTypeId) || ''}
									name="spaceTypeId"
									onChange={setSpaceTypeId}
								>
									<MenuItem value="">None</MenuItem>
									{spaceTypeList.map((i: SpaceTypeInterface) => (
										<MenuItem value={i.id} key={i.id}>
											{i.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={12} className={classes.filterItem}>
							<DatePicker
								label="Booking date from"
								inputFormat="YYYY-MM-DD"
								value={selectedDate}
								onChange={handleDateChange}
								renderInput={(props) => <TextField {...props} variant="standard" />}
							/>
						</Grid>

						<Grid item xs={12} className={classes.filterItem}>
							<DatePicker
								label="Reservation start date"
								inputFormat="YYYY-MM-DD"
								value={hoursFrom}
								onChange={handleHoursFromChange}
								renderInput={(props) => <TextField {...props} variant="standard" />}
							/>
						</Grid>
					</Grid>
				</AccordionDetails>
			</Accordion>
		</Paper>
	);
}
