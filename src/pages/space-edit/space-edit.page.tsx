import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Theme, useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import { Helmet } from 'react-helmet';
import VenueInterface from 'dd-common-blocks/dist/interface/venue.interface';
import FormSpaceComponent from '@forms/form-space.component';
import SpaceService from '@service/space.service';
import VenueService from '@service/venue.service';
import BasePage from '../base.page';
import BreadcrumbsComponent from '../../components/breadcrumbs.component';
import SpaceSidebarComponent from './space-sidebar.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		rootMobile: {
			width: '100%',
			height: '100%',
			margin: 0,
		},
		root: {
			width: 'calc(100% - 90px)',
			// height: '100%',
			margin: 0,
			marginLeft: 90,
		},
		leftSide: {
			maxWidth: 350,
			position: 'fixed',
			width: 350,
			zIndex: 1,
			height: 'calc(100vh - 75px)',
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				width: '100%',
				position: 'relative',
				paddingRight: 24,
				height: 'auto',
			},
		},
		rightSide: {
			marginLeft: 350,
			width: 'calc(100% - 350px)',
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				marginLeft: 0,
				paddingRight: 24,
			},
		},
		formWrapper: {
			padding: 25,
		},
	})
);

export default function SpaceEditPage() {
	const theme = useTheme();
	const classes = useStyles({});

	const { spaceId, venueId } = useParams();

	const spaceService = new SpaceService();
	const venueService = new VenueService();

	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;

	const [selectedVenues, setSelectedVenues] = useState<number[]>([Number(venueId)]);
	const [loading, setLoading] = useState(true);
	const [spaceData, setSpaceData] = useState<SpaceInterface>();
	const [venueData, setVenueData] = useState<VenueInterface>();

	const loadVenue = useCallback(async () => {
		const data = await venueService.single(venueId);
		setVenueData(data);
	}, []);

	const loadSpace = useCallback(async () => {
		const data = await spaceService.single(spaceId);
		setSpaceData(data);
		setLoading(false);
	}, []);

	useEffect(() => {
		loadVenue().then(() => {
			if (spaceId !== '0') {
				loadSpace().then(() => setLoading(false));
			} else {
				setLoading(false);
			}
		});
	}, []);

	const handleVenueSelect = (venuesIds: number[]) => {
		setSelectedVenues(venuesIds);
	};

	return (
		<BasePage>
			<Helmet>
				<title>{`Space ${loading || !spaceData ? ' create' : ` edit - ${spaceData.name}`}`}</title>
				<meta name="description" content="Space" />
			</Helmet>

			<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
				<Grid item xs={12} md={2} xl={2} className={classes.leftSide}>
					<SpaceSidebarComponent onSelect={handleVenueSelect} />
				</Grid>

				<Grid item xs={12} md={9} xl={10} className={classes.rightSide}>
					<Grid container spacing={3}>
						<Grid item sm={12} xs={12} style={{ position: 'relative' }}>
							<BreadcrumbsComponent
								primary={`${spaceId !== '0' ? 'Edit' : 'Add'} a package:`}
								secondary={spaceId !== '0' && spaceData ? spaceData.name : ''}
							/>
						</Grid>
						<Grid item lg={10} md={12} xs={12}>
							{loading && <LinearProgress />}
							{!loading && venueData && (
								<FormSpaceComponent venueIds={selectedVenues} initialValues={spaceData} venueData={venueData!} />
							)}
							<br />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</BasePage>
	);
}
