import { useParams, Link, useNavigate } from 'react-router-dom';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Theme, useMediaQuery, useTheme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import VenueTypeInterface from 'dd-common-blocks/dist/interface/venue-type.interface';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GetAppIcon from '@mui/icons-material/GetApp';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import VenueFilterInterface from 'dd-common-blocks/dist/interface/filter/venue-filter.interface';
import Divider from '@mui/material/Divider';
import VenueInterface from 'dd-common-blocks/dist/interface/venue.interface';
import VenueStatus from 'dd-common-blocks/dist/type/VenueStatus';
import { AuthContext } from '@context/auth.context';
import VenueTypeService from '@service/venue-type.service';
import VenueService from '@service/venue.service';
import WeekdaySorterHelper from '@helpers/weekday.sort.helper';
import AvatarComponent from '@shared-components/avatar.component';
import AccessHFormValues from '@forms/interface/access-h-form-values.interface';
import { isSuperAdmin } from '@helpers/user/is-admin.helper';
import InfiniteScroll from 'react-infinite-scroll-component';
import FormControl from '@mui/material/FormControl';
import Scrollbars from 'react-custom-scrollbars';
import Skeleton from '@mui/material/Skeleton';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		headTitle: {
			// paddingLeft: 20,
		},
		venueItemActive: {
			width: '100%',
			padding: 15,
			textDecoration: 'none',
			borderWidth: '1px',
			borderStyle: 'solid',
			borderColor: theme.palette.primary.main,
			backgroundColor: '#dcedfb',
			borderRadius: 0,
		},
		venueItemDisabled: {
			width: '100%',
			cursor: 'pointer',
			borderRadius: 0,
			top: 0,
			left: 0,
			height: '100%',
			position: 'absolute',
			background: 'rgba(255, 255, 255, 0.7)',
			zIndex: 9,
			'& div': {
				position: 'absolute',
				bottom: 5,
				right: 5,
				cursor: 'pointer',
			},
		},
		venueItem: {
			width: '100%',
			padding: 15,
			borderWidth: '1px',
			borderColor: 'transparent',
			borderStyle: 'solid',
			borderTopColor: theme.palette.grey['300'],
			textDecoration: 'none',
			cursor: 'pointer',
			borderRadius: 0,
			position: 'relative',
			'&:hover, &.venueItemActive': {
				borderColor: theme.palette.primary.main,
				backgroundColor: '#dcedfb',
			},
		},
		venueTitle: {
			fontSize: 15,
			lineHeight: '18px',
		},
		venueSubTitle: {
			fontSize: 12,
		},
		venueTitleWrap: {
			height: 64,
		},
		spaces: {
			marginTop: 25,
			height: 'calc(100vh - 430px) !important',
			[theme.breakpoints.down('md')]: {
				height: 'calc(100vh - 430px) !important',
			},
		},
		topTitleWrap: {
			// paddingRight: 25,
			[theme.breakpoints.down('md')]: {
				'& > .MuiGrid-root': {
					paddingLeft: 0,
				},
			},
		},
		accDetails: {
			padding: 0,
			borderTop: '1px solid #d5d5d5',
			flexDirection: 'column',
			'& .MuiFilledInput-underline:before': {
				display: 'none',
			},
			'& .MuiFilledInput-underline:after': {
				display: 'none',
			},
			'& .MuiAutocomplete-inputRoot[class*="MuiFilledInput-root"]': {
				paddingTop: 8,
				paddingBottom: 8,
			},
		},
		spacesContainer: {
			padding: 15,
			width: '100%',
			margin: 0,
			[theme.breakpoints.down('md')]: {
				padding: 0,
			},
		},
		spacesContainerItem: {
			'& > .MuiPaper-root': {
				borderRadius: 0,
			},
			[theme.breakpoints.down('md')]: {
				padding: '0 !important',
			},
		},
		venueTypeSelect: {
			padding: '0 25px !important',
			'& .MuiInputLabel-root': {
				paddingTop: 8,
				paddingLeft: 50,
				color: '#989898',
				'&.MuiInputLabel-shrink': {
					padding: 0,
				},
			},
		},
	})
);

export default function VenueSidebarComponent({ reload }: { reload?: any }) {
	const classes = useStyles({});
	const venueService = new VenueService();
	const venueTypeService = new VenueTypeService();
	const { venueId } = useParams();
	const navigate = useNavigate();
	const theme = useTheme();
	const isPhone = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });
	const { authBody, isBrandAdmin } = useContext(AuthContext);
	const [searchParams, setSearchParams] = useState<VenueFilterInterface>({
		limit: 10,
		brandId: !isSuperAdmin(authBody) ? authBody?.brandId : undefined,
		offset: 0,
	});
	const [isDataLoading, setIsDataLoading] = useState(false);
	const [totalCount, setTotalCount] = useState(0);
	const [expanded, setExpanded] = useState<boolean>(!isPhone);
	const [venuesList, setVenuesList] = useState<VenueInterface[]>([]);
	const [types, setTypes] = useState<VenueTypeInterface[]>([]);
	const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
	const [height, setHeight] = useState(300);

	const handleExpand = () => {
		setExpanded(isPhone ? !expanded : true);
	};

	const handleVenueSelect = (venueUrl: string) => () => {
		navigate(venueUrl);
		if (isPhone) handleExpand();
	};

	const loadLocations = useCallback(async () => {
		const locationsList = await venueService.listLocations('', searchParams.venueTypeIds);
		setLocationSuggestions(locationsList);
	}, [searchParams]);

	const loadTypes = useCallback(async () => {
		const [typesResp] = await venueTypeService.list({ limit: 700 });
		setTypes(typesResp);
	}, []);

	const nextPage = () => {
		if (isDataLoading) return;
		setSearchParams({ ...searchParams, offset: Number(searchParams?.offset || 0) + 10 });
	};

	const loadVenues = useCallback(async () => {
		setIsDataLoading(true);
		const [venues, total] = await venueService.list(searchParams);
		const newData = searchParams.offset === 0 ? venues : [...venuesList, ...venues];
		setVenuesList(newData);
		setTotalCount(total);
		setIsDataLoading(false);
	}, [reload, searchParams]);

	useEffect(() => {
		setSearchParams(searchParams);
	}, [authBody, reload]);

	useEffect(() => {
		loadTypes().then(() => {
			loadLocations().then();
			if (authBody) loadVenues().then();
		});
	}, [searchParams]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchParams({ ...searchParams, searchString: e.target.value.toLowerCase() });
	};

	const handleLocationSearch = (event: any, val: string) => {
		const vals = val.split(',').map((i: string) => i.trim());
		setSearchParams({ ...searchParams, city: vals[2], country: vals[0], state: vals[1] });
	};

	const handleVenueType = (e: SelectChangeEvent) => {
		setSearchParams({ ...searchParams, venueTypeIds: [Number(e.target.value)] });
	};

	const getItemClass = (v: VenueInterface) => (venueId === String(v.id) ? classes.venueItemActive : classes.venueItem);

	const ref = useRef(null);

	const handleWindowResize = () => {
		if (ref !== null && ref.current) {
			// @ts-ignore
			setHeight(ref?.current.container.clientHeight);
		}
	};

	useEffect(() => {
		window.addEventListener('resize', handleWindowResize);

		return () => window.removeEventListener('resize', handleWindowResize);
	}, []);

	useEffect(() => handleWindowResize());

	const exportAsExcelFile = async () => {
		const xlsx = await import('xlsx');
		const [items] = await venueService.list({ ...searchParams, withCreatedBy: true, withUpdatedBy: true });

		const exportData = items.map((v, i) => {
			const {
				id,
				name,
				tzId,
				tzOffset,
				brandId,
				countryCode,
				accessOpen,
				description,
				coordinates,
				address,
				address2,
				city,
				state,
				country,
				currency,
				phone,
				email,
				createdAt,
				updatedAt,
				accessHoursFrom,
				accessHoursTo,
				createdById,
				createdBy,
				updatedBy,
				accessCustomData,
			} = v;

			const s: any = {};
			if (accessCustomData)
				(accessCustomData as AccessHFormValues[])
					.sort(WeekdaySorterHelper)
					.forEach((ac) => (s[`Access Custom ${ac.weekday}`] = ac.open ? `${ac.accessHoursFrom} - ${ac.accessHoursTo}` : 'Closed'));

			return {
				'#': i + 1,
				ID: id,
				Name: name,
				Email: email,
				Phone: phone,
				City: city,
				State: state,
				Country: country,
				'Country code': countryCode,
				Currency: currency,
				Address: address,
				Address2: address2,
				Description: description,
				tzId,
				tzOffset: tzOffset / 60,
				brandId,
				createdAt,
				updatedAt,
				createdById,
				updatedById: updatedBy && updatedBy.id,
				createdBy: createdBy && `${createdBy.firstname} ${createdBy.lastname}`,
				updatedBy: updatedBy && `${updatedBy.firstname} ${updatedBy.lastname}`,
				accessOpen,
				accessHoursFrom,
				accessHoursTo,
				Coordinates: coordinates.coordinates.toString(),
				...s,
			};
		});

		const wb = xlsx.utils.book_new();

		const ws = xlsx.utils.json_to_sheet(exportData);

		ws['!cols'] = [
			{ width: 5 },
			{ width: 5 }, // id
			{ width: 30 }, // name
			{ width: 25 }, // email
			{ width: 15 }, // phone
			{ width: 20 }, // city
			{ width: 20 }, // state
			{ width: 20 }, // country
			{ width: 5 }, // country code
			{ width: 7 }, // currency
			{ width: 40 }, // address
			{ width: 40 }, // address
			{ width: 40 }, // description
			{ width: 20 }, // tz id
			{ width: 7 }, // tz offset
			{ width: 5 }, // brandId
			{ width: 30 }, // created by
			{ width: 30 }, // updated by
			{ width: 5 }, // created by id
			{ width: 5 }, // updated by id
			{ width: 25 }, // created by
			{ width: 25 }, // updated by
			{ width: 10 }, // access open
			{ width: 10 }, // hours from
			{ width: 10 }, // hours to
			{ width: 25 }, // coordinates
			{ width: 25 }, // access custom mon
			{ width: 25 }, // access custom tue
			{ width: 25 }, // access custom wen
			{ width: 25 }, // access custom thu
			{ width: 25 }, // access custom fri
			{ width: 25 }, // access custom sat
			{ width: 25 }, // access custom sun
		];

		if (wb)
			wb.Props = {
				Title: `Venues export`,
				Subject: `Venues export`,
				Author: 'DropDesk',
				CreatedDate: new Date(),
			};

		xlsx.utils.book_append_sheet(wb, ws, 'Venues export');
		xlsx.writeFile(wb, `Venues_export.xlsx`);
	};

	const renderEmptyItems = (
		<Grid container spacing={2} className={classes.spaces} style={{ marginTop: 0 }}>
			{Array.from(new Array(3)).map((space, index) => (
				<Grid item xs={12} key={index} className={classes.venueItem} component={Button}>
					<Grid container>
						<Grid item xs={4} style={{ paddingLeft: 15 }}>
							<Skeleton variant="circular" width={64} height={64} />
						</Grid>
						<Grid item xs={8} className={classes.venueTitleWrap}>
							<Skeleton variant="text" width="40%" style={{ margin: '0 auto' }} className={classes.venueTitle} />
							<Skeleton variant="text" width="100%" className={classes.venueSubTitle} />
						</Grid>
					</Grid>
				</Grid>
			))}
		</Grid>
	);

	return (
		<Paper style={{ height: '100%' }}>
			<Accordion expanded={expanded} onChange={handleExpand} style={{ borderRadius: 4 }}>
				<AccordionSummary expandIcon={isPhone ? <ExpandMoreIcon /> : ''}>
					<Grid container spacing={1} justifyContent="space-between" alignItems="center" className={classes.topTitleWrap}>
						<Grid item>
							<Typography className={classes.headTitle}>MY VENUES</Typography>
						</Grid>
						<Grid item>
							<Button color="primary" component={Link} replace to="/dashboard/venue/0" startIcon={<AddIcon />}>
								Add Venue
							</Button>
						</Grid>
						{(isSuperAdmin(authBody) || isBrandAdmin) && (
							<Grid item>
								<IconButton aria-label="delete" onClick={exportAsExcelFile} size="large">
									<GetAppIcon style={{ color: '#2196f3', fontSize: 20 }} />
								</IconButton>
							</Grid>
						)}
					</Grid>
				</AccordionSummary>
				<AccordionDetails className={classes.accDetails}>
					<Grid container spacing={3} style={{ width: '100%', marginLeft: 0, paddingTop: 15 }}>
						<Grid item xs={12} style={{ padding: '5px 25px 0px 25px' }}>
							<TextField
								variant="filled"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon />
										</InputAdornment>
									),
								}}
								name="searchString"
								placeholder="Search Venues"
								fullWidth
								onChange={handleSearch}
							/>
						</Grid>
						<Grid item xs={12} style={{ padding: '0 25px 0px 25px' }}>
							<Autocomplete
								onInputChange={handleLocationSearch}
								freeSolo
								autoHighlight
								options={locationSuggestions}
								renderInput={(params) => (
									<TextField
										placeholder="Venue location"
										variant="filled"
										{...params}
										InputProps={{
											...params.InputProps,
											startAdornment: (
												<InputAdornment position="start">
													<LocationOnIcon />
												</InputAdornment>
											),
										}}
									/>
								)}
							/>
						</Grid>
						<Grid item xs={12} className={classes.venueTypeSelect}>
							<FormControl fullWidth>
								<InputLabel id="venue-type-select-label">Venue Type</InputLabel>

								<Select
									labelId="venue-type-select-label"
									name="venueType"
									inputProps={{ 'aria-label': 'Without label' }}
									displayEmpty
									variant="filled"
									fullWidth
									onChange={handleVenueType}
									label="Venue type"
								>
									<MenuItem value={0} selected>
										All
									</MenuItem>
									{types.map((i: VenueTypeInterface) => (
										<MenuItem value={i.id} key={i.id}>
											{i.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
					</Grid>

					<Grid container spacing={0}>
						<Scrollbars universal ref={ref} autoHide className={classes.spaces}>
							<InfiniteScroll
								dataLength={venuesList.length}
								next={nextPage}
								hasMore={venuesList.length < Number(totalCount)}
								loader={renderEmptyItems}
								height={height}
							>
								{venuesList.map((v: VenueInterface) => (
									<Grid
										item
										xs={12}
										key={v.id}
										className={getItemClass(v)}
										component={Button}
										onClick={handleVenueSelect(`/dashboard/venue/${v.id}`)}
									>
										<>
											{v.status === VenueStatus.DELETED && (
												<div className={classes.venueItemDisabled}>
													<Chip variant="outlined" size="small" label="Deleted" color="secondary" />
												</div>
											)}
											<Grid container>
												<Grid item xs={4}>
													<AvatarComponent
														size="md"
														src={
															v.photos && v.photos[0]
																? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}/64x64_cover${v.photos[0].url}`
																: undefined
														}
														altText={v.name}
													/>
												</Grid>
												<Grid item xs={8} className={classes.venueTitleWrap}>
													<Typography variant="subtitle1" className={classes.venueTitle}>
														{v.name}
													</Typography>
													<Typography className={classes.venueSubTitle}>{v.brand!.name}</Typography>
												</Grid>
											</Grid>
										</>
									</Grid>
								))}
							</InfiniteScroll>
						</Scrollbars>
					</Grid>
				</AccordionDetails>
			</Accordion>

			<Divider />
		</Paper>
	);
}
