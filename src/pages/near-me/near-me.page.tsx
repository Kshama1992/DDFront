import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import VenueInterface from 'dd-common-blocks/dist/interface/venue.interface';
import SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import SpaceInterface, { SpaceStatus } from 'dd-common-blocks/dist/interface/space.interface';
import SpaceFilterInterface from 'dd-common-blocks/dist/interface/filter/space-filter.interface';
import { SpaceFiltersContext, SpaceFiltersProvider } from '@context/space-filters.context';
import SpaceService from '@service/space.service';
import { GeolocationData } from '@helpers/geolocate.helper';
import generateSlug from '@helpers/slug.helper';
import VenueService from '@service/venue.service';
import LandingPage from '../landing.page';
import MetaComponent from '../../components/meta.component';
import FormNearMeComponent from './form-near-me.component';
import SpaceSkeletonComponent from '../space-list/space-skeleton.component';
import SpaceListItem from '../space-list/space-list-item.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			'& h3': {
				fontWeight: 500,
				color: '#333',
			},
			'& h2': {
				fontWeight: 400,
				color: '#303339',
				fontSize: 30,
			},
			'& p,& h2,& h3': {
				textAlign: 'center',
			},
		},
		textContainer: {
			padding: 15,
			width: '100%',
			margin: 0,
			textAlign: 'center',
			// height: '100%',
		},
		topBannerWrapper: {
			backgroundImage: 'url(/images/landing/near-me/bg_top.jpg)',
			height: '70vh',
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			minHeight: 640,
		},
		itemsWrapper: {
			borderBottom: '1px solid #e3e4e8',
			paddingBottom: 30,
		},
		footerWrapper: {
			paddingBottom: 60,
			// paddingTop: 60,
			'& a:hover': {
				textDecoration: 'underline',
			},
			'& a': {
				marginTop: 15,
				marginLeft: 5,
				display: 'inline-block',
				textDecoration: 'none',
				color: '#3698e3',
				fontSize: 14,
			},
		},
		titleSkeleton: {
			paddingTop: 15,
			textAlign: 'center',
			margin: '15px auto 10px auto',
			maxWidth: 400,
		},

		infoWrapper: {
			borderBottom: '1px solid #e3e4e8',
			paddingBottom: 30,
			'& p': {
				color: '#929399',
				fontSize: 15,
				fontWeight: 400,
				paddingLeft: 15,
				paddingRight: 15,
				lineHeight: 1.7,
			},
		},
		topFormWrapper: {
			marginTop: 130,
			marginLeft: 90,
			backgroundColor: theme.palette.common.white,
			borderRadius: 5,
			padding: 40,
			paddingTop: 15,
			width: 'calc(90% - 90px)',
			boxSizing: 'border-box',
			'& h1': {
				fontSize: 37,
			},
			[theme.breakpoints.down('md')]: {
				marginLeft: 0,
				width: '100%',
				'& h1': {
					fontSize: 27,
				},
			},
		},
		iconBase: {
			display: 'block',
			margin: '40px auto 25px auto',
			width: 150,
			height: 150,
			backgroundSize: '100% auto',
			backgroundRepeat: 'no-repeat',
			backgroundImage: 'url(/images/landing/near-me/css_sprites.png)',
		},
		iconBenefits: {
			backgroundPosition: '0 0',
		},
		iconConnection: {
			backgroundPosition: '0 -450px',
			height: 155,
			marginTop: 35,
		},
		iconMember: {
			backgroundPosition: '0 -150px',
		},
		iconNear: {
			backgroundPosition: '0 -300px',
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
		btnMore: {
			background: '#3698e3',
			color: '#fff',
			borderRadius: '4px',
			fontSize: 16,
			padding: '16px 20px',
			textDecoration: 'none',
			margin: '15px auto',
			display: 'block',
			width: 220,
			textAlign: 'center',
			textTransform: 'uppercase',
		},
	})
);

function NearMePageInner() {
	const classes = useStyles({});
	const spaceService = new SpaceService();
	const venueService = new VenueService();

	const { pathname } = useLocation();

	// @ts-ignore
	const { spaceTypeSlug } = useParams();
	const { spaceTypes } = useContext(SpaceFiltersContext);
	const [loading, setLoading] = useState(true);
	const [inited, setInited] = useState(false);
	const [footerLinks, setFooterLinks] = useState<Partial<VenueInterface>[]>([]);
	const [data, setData] = useState<SpaceInterface[]>([]);
	// TODO: @TESTME: possible bug when we have undefined user location
	const [params, setParams] = useState<SpaceFilterInterface | undefined>();
	const [currentSpaceType, setCurrentSpaceType] = useState<SpaceTypeInterface>();

	const [h1, setH1] = useState(`Find spaces Near You`);
	const [heading, setHeading] = useState(`Popular spaces`);
	const [title, setTitle] = useState('Find spaces near you - Book spaces - DropDesk');
	const [description, setDescription] = useState('Book spaces near you. Choose from the best spaces and increase your productivity.');

	const handleFilterChanged = ({ location, spaceType }: { location: GeolocationData | undefined; spaceType: SpaceTypeInterface | undefined }) => {
		setLoading(true);

		setCurrentSpaceType(spaceType);

		const oldParams: SpaceFilterInterface | undefined = { ...params };

		let spaceTypeIds: number[] | undefined = spaceType && spaceType.id ? [spaceType.id] : undefined;
		if (spaceType && spaceType.children) {
			spaceTypeIds = spaceType.children.filter((i) => i && i.id).map((c: SpaceTypeInterface) => Number(c.id));
		}

		const newParams = {
			...oldParams,
			...location,
			spaceTypeIds,
		};

		const newParams2 = { ...newParams, latitude: String(newParams.latitude), longitude: String(newParams.longitude) };
		delete newParams.latitude;
		delete newParams.longitude;

		if (JSON.stringify(newParams) === JSON.stringify(oldParams)) return;
		setParams({ ...newParams2, offset: 0 });

		if (spaceType) {
			let spaceSlug: string;
			switch (spaceType.alias) {
				case 'coworking-space':
					spaceSlug = 'coworking-spaces';
					break;
				case 'meeting-space':
					spaceSlug = 'meeting-rooms';
					break;
				case 'office-space':
					spaceSlug = 'shared-office-space';
					break;
				default:
					spaceSlug = spaceType.alias;
					break;
			}

			const url = `/${spaceSlug}-near-me`;

			if (pathname !== url) {
				window.location.href = `/${spaceSlug}-near-me`;
				// push(`/${spaceSlug}-near-me`);
				// setInited(true)
			}
		}
	};

	const loadCities = async () => {
		try {
			const items = await venueService.listCities();
			setFooterLinks(items);
		} catch (e) {
			console.error(e);
			setLoading(false);
		}
	};

	useEffect(() => {
		if (currentSpaceType && currentSpaceType.name !== 'All') {
			setTitle(`Find ${currentSpaceType.name}s near you - Book ${currentSpaceType.name}s - DropDesk`);
			setH1(`Find ${currentSpaceType.name}s Near You`);
			setHeading(`Popular ${currentSpaceType.name}s`);
			setDescription(`Book ${currentSpaceType.name}s near you. Choose from the best ${currentSpaceType.name}s and increase your productivity.`);
			loadCities().then();
		}
	}, [currentSpaceType]);

	const loadData = async (inputParams: SpaceFilterInterface | undefined) => {
		if (!inputParams) return;
		try {
			const [items] = await spaceService.list({
				...inputParams,
				withCache: true,
				status: SpaceStatus.PUBLISH,
				limit: 8,
			});

			const newData = inputParams.offset === 0 ? items : [...data, ...items];
			setData(newData);
			setLoading(false);
		} catch (e) {
			console.error(e);
			setLoading(false);
		}
	};

	useEffect(() => {
		let spaceSlug: string;
		switch (spaceTypeSlug) {
			case 'coworking-spaces':
				spaceSlug = 'coworking-space';
				break;
			case 'meeting-rooms':
				spaceSlug = 'meeting-space';
				break;
			case 'shared-office-space':
				spaceSlug = 'office-space';
				break;
			default:
				spaceSlug = spaceTypeSlug;
				break;
		}

		const thisSpaceType = spaceTypes.find((st: SpaceTypeInterface) => st && st.alias === String(spaceSlug));
		setCurrentSpaceType(thisSpaceType);
		setParams({ ...params, spaceTypeIds: thisSpaceType && thisSpaceType.id ? [thisSpaceType.id] : [] });
		setInited(true);
	}, []);

	useEffect(() => {
		loadData(params)
			.then()
			.catch((e) => console.error(`params not changed`, e));
	}, [params]);

	return (
		<LandingPage>
			<MetaComponent title={title} description={description} />

			<Grid container className={classes.root} alignItems={'center'} justifyContent="center">
				<Grid item xs={12} className={classes.topBannerWrapper}>
					<Grid container>
						<Grid item md={6}>
							<div className={classes.topFormWrapper}>
								<h1>{h1}</h1>
								{inited && <FormNearMeComponent defaultValues={{ ...params }} onSubmit={handleFilterChanged} />}
							</div>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={12} className={classes.itemsWrapper}>
					{inited && <h2>{heading}</h2>}

					<Grid container>
						{!loading && (!data || !data.length) && (
							<Grid item xs={12} md={12} className={classes.textContainer}>
								<Typography>No {currentSpaceType ? `${currentSpaceType.name.toLowerCase()}s` : 'spaces'} in your location</Typography>
							</Grid>
						)}
						<Grid item xs={12}>
							{loading && (
								<Grid container spacing={2} className={classes.spacesContainer}>
									{Array.from(new Array(4)).map((space, index) => (
										<Grid item xs={12} xl={3} md={3} key={index} className={classes.spacesContainerItem}>
											<Paper>
												<SpaceSkeletonComponent />
											</Paper>
										</Grid>
									))}
								</Grid>
							)}

							<Grid container spacing={2} className={classes.spacesContainer}>
								{data.map((space: any, index: number) => (
									<Grid item xs={12} md={3} xl={3} key={index} className={classes.spacesContainerItem}>
										<SpaceListItem space={space} />
									</Grid>
								))}

								<Grid item xs={12}>
									<a
										href={`/locations/${params && params.country ? generateSlug(params.country) : 'united-states'}/${
											currentSpaceType ? `${currentSpaceType.alias}/all` : 'all/all'
										}`}
										className={classes.btnMore}
									>
										View all {currentSpaceType && `${currentSpaceType.name}s`}
									</a>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={12} className={classes.infoWrapper}>
					<h2>How it Works</h2>
					<Grid container spacing={3} style={{ paddingLeft: 40, paddingRight: 40 }}>
						<Grid item md={3}>
							<span className={`${classes.iconBase} ${classes.iconMember}`} />
							<h3>1. Pick a Plan</h3>
							<p>
								Choose a plan that works for you or give your entire team unlimited access to DropDesk in just a few steps. Cancel
								anytime.
							</p>
							<Button style={{ display: 'flex' }} href="https://drop-desk.com/pass" color="primary" endIcon={<ChevronRightIcon />}>
								View Plans
							</Button>
						</Grid>
						<Grid item md={3}>
							<span className={`${classes.iconBase} ${classes.iconNear}`} />
							<h3>2. Workspaces Near You</h3>
							<p>
								Search for workspaces in your area or let us know where your employees need workspaces, and we’ll take care of the
								rest.
							</p>
							<Button style={{ display: 'flex' }} href="/" color="primary" endIcon={<ChevronRightIcon />}>
								Browse Locations
							</Button>
						</Grid>
						<Grid item md={3}>
							<span className={`${classes.iconBase} ${classes.iconBenefits}`} />
							<h3>3. Check-In</h3>
							<p>
								Check-in to safe spaces and track usage in real-time. Every space is vetted to ensure hosts meet strict quality
								standards.
							</p>
						</Grid>
						<Grid item md={3}>
							<span className={`${classes.iconBase} ${classes.iconConnection}`} />
							<h3>4. Enjoy The Perks</h3>
							<p>
								Each DropDesk workspace offers amenities to ensure you can get to work. High-speed wifi, coffee, meeting spaces, and
								more.
							</p>
							<Button style={{ display: 'flex' }} href="https://drop-desk.com/store" color="primary" endIcon={<ChevronRightIcon />}>
								Marketplace
							</Button>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={8} className={classes.footerWrapper}>
					<Grid container alignItems={'center'} justifyContent="center">
						<Grid item xs={12} md={6} style={{ textAlign: 'center', paddingTop: 70, paddingBottom: 70 }}>
							<h1>{h1}</h1>
							{/* {inited && <FormNearMeComponent horizontal defaultValues={{ ...params }} onSubmit={handleFilterChanged} />} */}
						</Grid>
					</Grid>
					<Grid container style={{ paddingLeft: 30, paddingRight: 30, textAlign: 'center' }}>
						{inited &&
							footerLinks
								.filter((fl) => fl.city !== '')
								.map((l, k) => (
									<Grid key={k} item md={3} xs={6}>
										<a
											rel="nofollow noreferrer"
											target="_blank"
											href={`/locations/${l.country ? `${generateSlug(l.country)}/` : ''}${
												l.state && l.countryCode === 'US' ? `${generateSlug(l.state)}/` : 'no-state/'
											}${l.city ? `${generateSlug(l.city)}/` : ''}${
												currentSpaceType ? `${currentSpaceType.alias}/all` : 'all/all'
											}`}
										>
											{l.city}
										</a>
									</Grid>
								))}
					</Grid>
				</Grid>
			</Grid>
		</LandingPage>
	);
}

export default function NearMePage() {
	return (
		<SpaceFiltersProvider>
			<NearMePageInner />
		</SpaceFiltersProvider>
	);
}
