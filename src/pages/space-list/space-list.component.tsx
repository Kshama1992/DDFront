import pluralize from 'pluralize';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import ListIcon from '@mui/icons-material/List';
import IconButton from '@mui/material/IconButton';
import RoomIcon from '@mui/icons-material/Room';
import Typography from '@mui/material/Typography';
import InfiniteScroll from 'react-infinite-scroll-component';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import { Scrollbars } from 'react-custom-scrollbars';
import { StringifiableRecord, stringify as stringifyQueryString } from 'query-string';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SpaceInterface, { SpaceStatus } from 'dd-common-blocks/dist/interface/space.interface';
import SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import SpaceFilterInterface from 'dd-common-blocks/dist/interface/filter/space-filter.interface';
import PackageShow from 'dd-common-blocks/dist/type/PackageShow';
import SpacePinsOutputInterface from 'dd-common-blocks/dist/interface/custom-output/space-pins-output.interface';
import { DEFAULT_SPACES_LIMIT } from '@core/config';
import SpaceService from '@service/space.service';
import { parseQueryHelper } from '@helpers/parse-query.helper';
import { GoogleMapPoint } from '@shared-components/google-maps.component';
import distanceFromTo from '@helpers/space/distance-from.helper';
import { AuthContext } from '@context/auth.context';
import { getLocalStorage } from '@helpers/storage.helper';
import { GeolocationData } from '@helpers/geolocate.helper';
import { SpaceFiltersContext } from '@context/space-filters.context';
import { getViewportRadius, googleGeocodeHelper } from '@helpers/google-geocode.helper';
import EmptyPage from '@pages/empty.page';
import { debounce } from '@helpers/debounce.helper';
import generateSlug from '@helpers/slug.helper';
import SpaceListPageStyles from './space-list.page.styles';
import SpaceListMap from './space-list-map.component';
import SpaceFilterMobileComponent from './space-filter-mobile.component';
import MetaComponent from '../../components/meta.component';
import SpaceListItem from './space-list-item.component';
import SpaceSkeletonComponent from './space-skeleton.component';
import MainMenuComponent from '../../components/mainMenu/main-menu.component';
import HeaderSpaceList from '../../components/header/header-space-list.component';
import Header from '../../components/header/header.component';

export default function SpaceListComponent({
	pageType = 'locations',
	defaultProps,
	metaDescription,
	metaImage,
	venueName,
}: {
	metaImage?: string;
	metaDescription?: string;
	defaultProps?: SpaceFilterInterface;
	venueName?: string;
	pageType?: 'near-me' | 'locations' | 'venue' | 'by-state';
}) {
	const classes = SpaceListPageStyles();
	const spaceService = new SpaceService();
	const navigate = useNavigate();
	const { venueAlias } = useParams();
	const { search } = useLocation();

	const { spaceTypes } = useContext(SpaceFiltersContext);

	const { userLocation } = useContext(AuthContext);

	// @ts-ignore
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'), { noSsr: true });
	const [mapVisible, setMapVisible] = useState(!isMobile);
	const [spacesVisible, setSpacesVisible] = useState(true);
	const [filterInitiated, setFilterInitiated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [mapNeedReCenter, setMapNeedReCenter] = useState(true);
	const [spaceMarkers, setSpaceMarkers] = useState<GoogleMapPoint[]>([]);

	const [totalCount, setTotalCount] = useState(0);
	const [data, setData] = useState<SpaceInterface[]>([]);
	const [isDataLoading, setIsDataLoading] = useState(false);
	const [currentSpaceType, setCurrentSpaceType] = useState<SpaceTypeInterface>();
	const [filters, setFilters] = useState<{ location: GeolocationData; spaceType: SpaceTypeInterface }>();

	const [params, setParams] = useState<SpaceFilterInterface | undefined>();
	const [mapInitialParams, setMapInitialParams] = useState<SpaceFilterInterface | undefined>();
	const [filterInitialParams, setFilterInitialParams] = useState<SpaceFilterInterface | undefined>();
	const [height, setHeight] = useState(300);

	const [h1, setH1] = useState('');
	const [title, setTitle] = useState('');
	const [image] = useState(metaImage || '/images/signin-logo.png');
	const [description, setDescription] = useState(metaDescription || '');

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

	useEffect(() => {
		const cookieParams = getLocalStorage('spaceFilters');
		const searchParams = parseQueryHelper(search);

		let parsedQueryParams: SpaceFilterInterface = {
			...searchParams,
		};

		if (!searchParams && cookieParams) {
			parsedQueryParams = { ...parsedQueryParams, ...cookieParams };
		}

		if (venueAlias) parsedQueryParams = { ...parsedQueryParams, venueAlias };

		// @ts-ignore
		if (typeof parsedQueryParams.amenities !== 'undefined') {
			// @ts-ignore
			if (!Array.isArray(parsedQueryParams.amenities)) {
				// @ts-ignore
				parsedQueryParams.amenities = [parsedQueryParams.amenities];
			}
			// @ts-ignore
			if (!Number.isInteger(parsedQueryParams.amenities[0])) {
				// @ts-ignore
				parsedQueryParams.amenities = parsedQueryParams.amenities.map((a: string) => Number(a));
			}
		}

		if (defaultProps) parsedQueryParams = { ...parsedQueryParams, ...defaultProps };
		setParams({ ...parsedQueryParams, offset: 0 });
		// setMapInitialParams({ ...parsedQueryParams, offset: 0 });
		setFilterInitialParams({ ...parsedQueryParams, offset: 0 });
	}, []);

	const loadData = useCallback(
		async (inputParams: SpaceFilterInterface | undefined) => {
			if (!inputParams || isDataLoading) return;
			try {
				// setIsDataLoading(true);
				const packageShowItems: PackageShow[] = Object.values(PackageShow);

				const [items, total] = await spaceService.list({
					...inputParams,
					// radius: getRadius(inputParams),
					status: SpaceStatus.PUBLISH,
					limit: DEFAULT_SPACES_LIMIT,
					packageShow: packageShowItems.filter((ps) => ![PackageShow.TEAM_MEMBERSHIP, PackageShow.MEMBERSHIP].includes(ps)),
				});

				const newData = inputParams.offset === 0 ? items : [...data, ...items];
				setData(newData);
				setTotalCount(total);
				setIsLoading(false);
				setIsDataLoading(false);
			} catch (e) {
				console.error(e);
				setIsLoading(false);
				setIsDataLoading(false);
			}
		},
		[params]
	);

	const loadPins = useCallback(
		async (inputParams: SpaceFilterInterface | undefined) => {
			if (!inputParams || isDataLoading) return;
			try {
				// setIsDataLoading(true);
				const packageShowItems: PackageShow[] = Object.values(PackageShow);

				const items = await spaceService.listPins({
					...inputParams,
					// radius: getRadius(inputParams),
					withCache: true,
					status: SpaceStatus.PUBLISH,
					limit: DEFAULT_SPACES_LIMIT,
					packageShow: packageShowItems.filter((ps) => ![PackageShow.TEAM_MEMBERSHIP, PackageShow.MEMBERSHIP].includes(ps)),
				});

				const markers: GoogleMapPoint[] = [];
				items.forEach((venueData: SpacePinsOutputInterface) => {
					const [longitude, latitude] = venueData.coordinates.coordinates;
					markers.push({
						lat: latitude,
						lng: longitude,
						id: venueData.id,
						alias: venueData.alias,
						packagesCount: venueData.spaceCount,
						show: false,
						hover: false,
						color: '#2F96E6',
						name: venueData.name,
						address: venueData.address,
						photo: venueData.photos?.length ? venueData.photos[0].url : '/images/default-image.jpg',
						distance: distanceFromTo(
							String(userLocation?.countryCode),
							{ latitude: Number(inputParams.latitude), longitude: Number(inputParams.longitude) },
							{ latitude, longitude }
						),
					});
				});
				setSpaceMarkers(markers);
				setIsDataLoading(false);
				setMapNeedReCenter(false);
				setMapInitialParams(params);
			} catch (e) {
				console.error(e);
				setIsLoading(false);
				setIsDataLoading(false);
			}
		},
		[params]
	);

	useEffect(() => {
		if (!params || isDataLoading) return;

		setFilterInitialParams(params);
		loadData(params)
			.then()
			.catch((e) => console.error(`params not changed`, e));
		loadPins(params)
			.then()
			.catch((e) => console.error(`params not changed`, e));
	}, [params]);

	const getPageH1 = () => {
		if (!params) return '';
		return `Showing 1-${data.length} of ${pluralize('space', totalCount, true)} near ${params.city || params.state || ''}${
			params.city || params.state ? ', ' : ''
		}${params.country}`;
	};

	const getPageDescription = (spaceTypeNameWithCounter: string) => {
		if (!params) return '';
		return `Explore the top ${spaceTypeNameWithCounter} in ${params.city || params.state || ''}${params.city || params.state ? ', ' : ''}${
			params.country
		}. DropDesk makes it easy to find the best workspaces for your business.`;
	};

	const changeUrl = (newParams: SpaceFilterInterface | undefined) => {
		const paramsToString = `?${stringifyQueryString(newParams as StringifiableRecord, { arrayFormat: 'index' })}`;
		if (paramsToString !== search && newParams) {
			let spaceTypesUrl = 'all/all';
			if (typeof newParams.spaceTypeIds !== 'undefined' && newParams.spaceTypeIds.length) {
				const parent = spaceTypes.find((s: SpaceTypeInterface) =>
					s.children?.some((st: SpaceTypeInterface) => newParams?.spaceTypeIds && st.id === Number(newParams?.spaceTypeIds[0]))
				);
				spaceTypesUrl = `${parent?.alias}/all`;
				if (newParams.spaceTypeIds.length === 1) {
					const child = parent.children.find((st) => st.id === newParams.spaceTypeIds[0]);
					if (child) {
						spaceTypesUrl = `${parent?.alias}/${child.alias}`;
						setCurrentSpaceType({ ...child, parent });
						// if(pageType === 'near-me') spaceTypesUrl = `${child.alias}-near-me`
					} else setCurrentSpaceType(parent);
				} else setCurrentSpaceType(parent);
			}

			let url = `/locations/${newParams.country ? generateSlug(newParams.country) : 'united-states'}/${
				// eslint-disable-next-line no-nested-ternary
				newParams?.state ? `${generateSlug(newParams.state)}/` : newParams.city && !newParams.state ? '' : ''
			}${newParams.city ? `${generateSlug(newParams.city)}/` : ''}${spaceTypesUrl}`;

			if (pageType === 'venue') url = `/venue/${newParams.venueAlias}/${newParams.address}/${spaceTypesUrl}`;

			if (!['near-me', 'by-state'].includes(pageType)) {
				navigate({ pathname: url }, { replace: true });
			}
		}
	};

	useEffect(() => {
		let pageH1 = getPageH1();

		const spaceTypeNameWithCounter = currentSpaceType
			? pluralize(currentSpaceType.parent ? currentSpaceType.parent.name : currentSpaceType.name, totalCount, true)
			: pluralize('space', totalCount, true);

		let pageTitle = params
			? `${spaceTypeNameWithCounter} near ${params.city || params.state || ''}${params.city || params.state ? ', ' : ''}${params.country}`
			: '';

		let pageDescription = getPageDescription(spaceTypeNameWithCounter);

		if (pageType === 'near-me') {
			pageH1 = `Find ${currentSpaceType ? pluralize(currentSpaceType.name.toLowerCase(), totalCount) : ''} near you`;
			pageTitle = `Find the best ${
				currentSpaceType ? pluralize(currentSpaceType.name.toLowerCase(), totalCount, true) : pluralize('space', totalCount, true)
			} near you | DropDesk`;
			pageDescription = `Explore the top ${spaceTypeNameWithCounter} near you. DropDesk makes it easy to find the best workspaces for your business.`;
		}

		if (pageType === 'venue') {
			pageH1 = pageTitle = data.length > 0 ? `${data[0].venue.name}, ${data[0].venue.address} | DropDesk` : '';
		}

		if (pageType === 'by-state') {
			pageH1 = pageTitle =
				params && data.length > 0
					? `The ${pluralize(`Best ${filters && filters.spaceType.name}`, totalCount, true)} In ${params.city} | DropDesk`
					: '';
			pageDescription = `Explore the top ${spaceTypeNameWithCounter} in ${
				params ? params.city : userLocation?.city || userLocation?.country
			}. DropDesk makes it easy to find the best workspaces for your business.`;
		}

		setTitle(pageTitle);
		setH1(pageH1);

		if (metaDescription) pageDescription = metaDescription;

		setDescription(pageDescription);
	}, [currentSpaceType, data, params, totalCount]);

	const handleFilterChanged = async ({ location, spaceType }: { location: GeolocationData; spaceType: SpaceTypeInterface }) => {
		const oldParams: SpaceFilterInterface | undefined = { ...params };
		let spaceTypeIds: number[] | undefined = spaceType.id ? [spaceType.id] : undefined;
		if (spaceType.children) {
			spaceTypeIds = spaceType.children.filter((i) => i && i.id).map((c: SpaceTypeInterface) => Number(c.id));
		}

		const newLoc = { ...location, latitude: location.latitude, longitude: location.longitude };

		const newParams = {
			...oldParams,
			...newLoc,
			spaceTypeIds: spaceTypeIds || [],
		};

		if (JSON.stringify(newParams) === JSON.stringify(oldParams)) return;

		changeUrl(newParams);

		setFilters({ location, spaceType });
		// setIsLoading(true);
		setParams({ ...newParams, offset: 0 });
	};

	const nextPage = () => {
		if (isDataLoading) return;
		setParams({ ...params, offset: Number(params?.offset || 0) + DEFAULT_SPACES_LIMIT });
	};

	const showMap = () => {
		setMapVisible(true);
		setSpacesVisible(false);
	};

	const showSpaces = () => {
		setMapVisible(false);
		setSpacesVisible(true);
	};

	const handleSpaceMouseEnter = (space: SpaceInterface) => {
		const cloneArr = [...spaceMarkers];

		setSpaceMarkers([
			...cloneArr.map((sm) => {
				const c = sm;
				c.hover = Number(sm.id) === Number(space.venueId);
				return c;
			}),
		]);
	};

	const handleSpaceMouseLeave = () => {
		setSpaceMarkers(
			spaceMarkers.map((sm: GoogleMapPoint) => {
				const c = sm;
				c.hover = false;
				return c;
			})
		);
	};

	const renderEmptyItems = (
		<Grid container spacing={2} className={classes.spacesContainer}>
			{Array.from(new Array(3)).map((space, index) => (
				<Grid item xs={12} xl={6} md={6} key={index} className={classes.spacesContainerItem}>
					<Paper>
						<SpaceSkeletonComponent />
					</Paper>
				</Grid>
			))}
		</Grid>
	);

	const renderSpaceItems = (itemsArr: SpaceInterface[]) => (
		<Grid container spacing={2} className={classes.spacesContainer}>
			{itemsArr.map((space: any, index: number) => (
				<Grid item xs={12} md={6} xl={6} key={index} className={classes.spacesContainerItem}>
					<SpaceListItem space={space} onMouseEnter={handleSpaceMouseEnter} onMouseLeave={handleSpaceMouseLeave} />
				</Grid>
			))}
		</Grid>
	);

	const onCoordsChanged = debounce(async (bounds: google.maps.LatLngBounds | undefined, center: google.maps.LatLng) => {
		const geocodedLocation = await googleGeocodeHelper({ bounds, location: { lat: center.lat(), lng: center.lng() } });

		if (!geocodedLocation.country && !geocodedLocation.countryCode) return;
		const newParams = { ...geocodedLocation, offset: 0, radius: getViewportRadius(bounds) };
		await loadPins(newParams);
		setParams(newParams);
	}, 300);

	const onZoomChanged = debounce(async (bounds: google.maps.LatLngBounds | null | undefined) => {
		const newParams = { ...params, offset: 0, radius: getViewportRadius(bounds) };
		if (newParams.radius === params?.radius) return;
		await loadData(newParams);
		await loadPins(newParams);
		setParams(newParams);
	}, 300);

	const initFilter = () => setFilterInitiated(true);

	return (
		<EmptyPage>
			{params && <MetaComponent title={title} description={description} image={image} />}

			{isMobile && <Header />}
			{!isMobile && (
				<>
					<HeaderSpaceList
						onFilterInitiated={initFilter}
						venueName={venueName}
						defaultValues={filterInitialParams}
						onChange={handleFilterChanged}
					/>
					<MainMenuComponent />
				</>
			)}

			<div style={{ paddingTop: 70, background: '#efefef', minHeight: 'calc(100vh - 90px)' }}>
				{isMobile && (
					<>
						{mapVisible && (
							<IconButton
								aria-label="list"
								onClick={() => showSpaces()}
								className={classes.mobileToggleViewBtn}
								color="primary"
								size="large"
							>
								<ListIcon />
							</IconButton>
						)}

						{spacesVisible && (
							<IconButton
								aria-label="map"
								onClick={() => showMap()}
								className={classes.mobileToggleViewBtn}
								color="primary"
								size="large"
							>
								<RoomIcon />
							</IconButton>
						)}
					</>
				)}

				<Grid container spacing={4} className={isMobile ? classes.spacesPageMobile : classes.spacesPage}>
					{spacesVisible && (
						<Grid item md={6} xs={12} style={{ padding: 0, margin: 0 }}>
							{isMobile && (
								<SpaceFilterMobileComponent
									onFilterInitiated={initFilter}
									venueName={venueName}
									defaultValues={filterInitialParams}
									onChange={handleFilterChanged}
								/>
							)}

							{!isLoading && (!data || !data.length) && (
								<Grid item xs={12} md={12} className={classes.textContainer}>
									<Typography component="span">There are no spaces in your search area,</Typography>
									<a style={{ textDecoration: 'none' }} href={`https://drop-desk.com/request-a-quote`}>
										<Typography variant="body2" component="span" color="primary">
											{' '}
											click here{' '}
										</Typography>
									</a>
									<Typography component="span">to request a location.</Typography>
								</Grid>
							)}

							{isLoading && (
								<>
									<Skeleton variant="text" className={classes.titleSkeleton} />

									{renderEmptyItems}
								</>
							)}

							{filterInitiated && (
								<Scrollbars universal ref={ref} autoHide className={classes.spaces}>
									<InfiniteScroll
										dataLength={data.length}
										next={nextPage}
										hasMore={data.length < Number(totalCount)}
										loader={renderEmptyItems}
										height={height}
									>
										{data && data.length > 0 && h1 && <Typography className={classes.title}>{h1}</Typography>}
										{renderSpaceItems(data)}
									</InfiniteScroll>
								</Scrollbars>
							)}
							{/* </Scrollbars> */}
						</Grid>
					)}

					{mapVisible && (
						<Grid item md={6} xs={12} style={{ padding: 0, margin: 0 }}>
							<SpaceListMap
								reCenter={mapNeedReCenter}
								spaceMarkers={spaceMarkers}
								onZoomChanged={onZoomChanged}
								onCoordsChanged={onCoordsChanged}
								initialLocation={mapInitialParams as GeolocationData}
							/>
						</Grid>
					)}
				</Grid>
			</div>
		</EmptyPage>
	);
}
