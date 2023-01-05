import { useParams, Link } from 'react-router-dom';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Theme, useMediaQuery, useTheme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';

import InputAdornment from '@mui/material/InputAdornment';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import VenueInterface from 'dd-common-blocks/dist/interface/venue.interface';
import { AuthContext } from '@context/auth.context';
import VenueService from '@service/venue.service';
import AvatarComponent from '@shared-components/avatar.component';
import CustomScrollbar from '@shared-components/custom-scrollbar.component';
import { isSuperAdmin } from '@helpers/user/is-admin.helper';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		paper: {
			height: '100%',
		},
		headTitle: {
			paddingTop: 15,
			paddingLeft: 20,
		},
		venueItemActive: {
			padding: 15,
			textDecoration: 'none',
			textAlign: 'left',
			borderRadius: 0,
			borderWidth: '1px',
			borderStyle: 'solid',
			borderColor: theme.palette.primary.main,
			backgroundColor: '#dcedfb',
		},
		venueItem: {
			borderRadius: 0,
			padding: 15,
			textDecoration: 'none',
			textAlign: 'left',
			borderWidth: '1px',
			borderColor: 'transparent',
			borderStyle: 'solid',
			borderTopColor: theme.palette.grey['300'],
			cursor: 'pointer',
			'&:hover, &.venueItemActive': {
				borderColor: theme.palette.primary.main,
				backgroundColor: '#dcedfb',
			},
		},
		venueTitle: {
			fontSize: 15,
			lineHeight: '18px',
			wordBreak: 'break-all',
		},
		venueSubTitle: {
			fontSize: 12,
		},
		venueTitleWrap: {
			// paddingTop: 15,
		},
		scrollWrap: {
			height: 'calc(100vh - 290px) !important',
			marginTop: 25,
		},
		topTitleWrap: {
			// marginBottom: 15,
			paddingRight: 25,
		},
		accDetails: {
			padding: 0,
			borderTop: '1px solid #d5d5d5',
			flexDirection: 'column',
		},
	})
);

export default function SpaceSidebarComponent({ reload, onSelect }: { reload?: any; onSelect: (val: number[]) => any }) {
	const classes = useStyles({});

	const { venueId } = useParams();

	const venueService = new VenueService();

	const theme = useTheme();
	const isPhone = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

	const { authBody } = useContext(AuthContext);
	const [expanded, setExpanded] = useState<boolean>(!isPhone);

	const [selectedVenues, setSelectedVenues] = useState<number[]>([Number(venueId)]);
	const [allSelected, setAllSelected] = useState<boolean>(false);
	const [searchString, setSearchString] = useState<string>('');
	const [venuesList, setVenuesList] = useState<VenueInterface[]>([]);
	const [searchVenueList, setSearchVenueList] = useState<VenueInterface[]>([]);

	const loadVenues = useCallback(async () => {
		const params: any = {
			limit: 999,
		};

		if (!isSuperAdmin(authBody)) {
			params.brandId = authBody?.brandId;
		}
		const [venues] = await venueService.list(params);

		setVenuesList(venues);
		setSearchVenueList(venues.filter((v: VenueInterface) => v.name.toLowerCase().search(searchString) !== -1));
	}, [reload]);

	useEffect(() => {
		if (authBody) loadVenues().then();
	}, [authBody, reload]);

	useEffect(() => {
		setSearchVenueList(venuesList.filter((v: VenueInterface) => v.name.toLowerCase().search(searchString) !== -1));
	}, [searchString]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchString(e.target.value.toLowerCase());
	};

	const handleExpand = () => {
		setExpanded(isPhone ? !expanded : true);
	};

	const handleSelect = (id: number) => {
		const index = selectedVenues.indexOf(id);
		if (index !== -1) {
			const clone = selectedVenues;
			clone.splice(index, 1);
			setSelectedVenues([...clone]);
			onSelect([...clone]);
		} else {
			setSelectedVenues([...selectedVenues, id]);
			onSelect([...selectedVenues, id]);
		}
	};

	const handleSelectAll = (event: React.ChangeEvent<any>, checked: boolean) => {
		setAllSelected(checked);
		setSelectedVenues(checked ? venuesList.map((v) => v.id!) : []);
	};

	return (
		<Paper className={classes.paper}>
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
					</Grid>
				</AccordionSummary>
				<AccordionDetails className={classes.accDetails}>
					<Grid container spacing={3} justifyContent="center">
						<Grid item>
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
								onChange={handleSearch}
							/>
						</Grid>
					</Grid>

					<Grid container justifyContent="flex-start" spacing={3}>
						<Grid item xs={12}>
							<FormControlLabel
								style={{ paddingLeft: 15, marginTop: 10, marginBottom: -15 }}
								onChange={handleSelectAll}
								control={
									<Checkbox
										icon={<RadioButtonUncheckedIcon />}
										checked={allSelected}
										color="primary"
										checkedIcon={<RadioButtonCheckedIcon />}
										name="checkedH"
									/>
								}
								label="Select All"
							/>
						</Grid>
					</Grid>

					<CustomScrollbar autoHide className={classes.scrollWrap}>
						<Grid container spacing={0}>
							{searchVenueList &&
								searchVenueList.map((v: VenueInterface) => (
									<Grid
										item
										xs={12}
										key={v.id}
										className={classes.venueItem}
										component={Button}
										onClick={() => handleSelect(v.id!)}
									>
										<Grid container alignItems="center" spacing={3} justifyContent="center">
											<Grid item xs={1}>
												{!selectedVenues.includes(v.id!) && (
													<RadioButtonUncheckedIcon color="primary" style={{ marginLeft: -15 }} />
												)}
												{selectedVenues.includes(v.id!) && (
													<RadioButtonCheckedIcon color="primary" style={{ marginLeft: -15 }} />
												)}
											</Grid>
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
											<Grid item xs={6} className={classes.venueTitleWrap}>
												<Typography variant="subtitle1" className={classes.venueTitle}>
													{v.name}
												</Typography>
												<Typography className={classes.venueSubTitle}>{v.brand!.name}</Typography>
											</Grid>
										</Grid>
									</Grid>
								))}
						</Grid>
					</CustomScrollbar>
				</AccordionDetails>
			</Accordion>
		</Paper>
	);
}
