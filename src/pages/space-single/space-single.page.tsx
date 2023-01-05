import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { parse as parseQueryString } from 'query-string';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import NearMeIcon from '@mui/icons-material/NearMe';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import { AuthContext, DEFAULT_LOCATION } from '@context/auth.context';
import SpaceService from '@service/space.service';
import GoogleMapsComponent, { GoogleMapPoint } from '@shared-components/google-maps.component';
import CustomScrollbar from '@shared-components/custom-scrollbar.component';
import distanceFromTo from '@helpers/space/distance-from.helper';
import SpaceAccessHoursComponent from '@shared-components/space-access-hours.component';
import RelatedSpaceComponent from '@shared-components/related-spaces.component';
import SpaceAmenityComponent from '@shared-components/space-amenity.component';
import getVenueDirectionsUrl from '@helpers/space/venue-derections-url.helper';
import AddressString from '@shared-components/address-string.component';
import ReadMoreComponent from '@shared-components/read-more.component';
import SpacePriceComponent from '@shared-components/space-price.component';
import SpaceAccessHoursListComponent from '@shared-components/space-access-hours-list.component';
import EmptyPage from '../empty.page';
import Header from '../../components/header/header.component';
import MainMenuComponent from '../../components/mainMenu/main-menu.component';
import SpaceSliderComponent from './space-slider.component';
import SpaceSinglePageStyle from './style/space-single.page.style';
import MetaComponent from '../../components/meta.component';
import ContactUsComponent from './contact-us.component';
import SpaceButtonsComponent from './space-buttons.component';
import SpaceFeaturesComponent from './space-features.component';
import ShareComponent from './share.component';
import EventDateComponent from './event-date.component';

export default function SpaceSinglePage() {
	const classes = SpaceSinglePageStyle();
	const spaceService = new SpaceService();

	const { isAuthenticated, userLocation } = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(true);

	const [space, setSpace] = useState<SpaceInterface | undefined>();
	const [relatedParams, setRelatedParams] = useState<any | undefined>();
	// @ts-ignore
	const isMobile = useMediaQuery((t) => t.breakpoints.down('md'), { noSsr: false });
	const { search } = useLocation();

	const searchParams = parseQueryString(search);
	const isFromMembership = !!searchParams.isFromMembership;

	// eslint-disable-next-line no-nested-ternary
	const rootHtmlClass = isMobile ? classes.spacesPageMobile : isAuthenticated && !isFromMembership ? classes.spacesPage : classes.spacesPageGuest;

	const { spaceSlug, venue, spaceId } = useParams();

	const loadData = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = spaceId ? await spaceService.single(spaceId) : await spaceService.bySlug(spaceSlug, venue);

			if (data) {
				setSpace(data);

				const [longitude, latitude] = data.venue.coordinates.coordinates;

				setRelatedParams({
					venueId: data.venueId,
					excludeIds: [data.id],
					longitude,
					latitude,
					limit: 10,
				});
			}
		} catch (e) {
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	}, [spaceSlug]);

	useEffect(() => {
		loadData().then();
	}, [spaceSlug]);

	if (isLoading || !space) return <LinearProgress />;

	const [longitude, latitude] = space.venue.coordinates.coordinates;

	const markers: GoogleMapPoint[] = [
		{
			lat: latitude,
			lng: longitude,
			id: space.venue.id,
			packagesCount: 1,
			name: space.venue.name,
			show: false,
			hover: true,
			address: space.venue.address,
			photo: space.venue.photos?.length ? space.venue.photos[0].url : '/images/default-image.jpg',
			color: space.spaceType.color || '#2F96E6',
			distance: distanceFromTo(
				userLocation?.countryCode || DEFAULT_LOCATION.countryCode,
				{ latitude: userLocation?.latitude || DEFAULT_LOCATION.latitude, longitude: userLocation?.longitude || DEFAULT_LOCATION.longitude },
				{ latitude, longitude }
			),
		},
	];

	const mainBLock = () => (
		<Grid container spacing={0} style={{ overflow: 'hidden' }}>
			<Grid item xs={12}>
				<SpaceSliderComponent space={space} />
			</Grid>

			<Grid item xs={12} className={classes.spaceTopDetails}>
				<Typography className={classes.spaceSingleName} component="h1">
					{space.name} - {space.venue.name}
				</Typography>

				{isMobile && <SpaceAccessHoursComponent space={space} className={classes.spaceSingleSpaceSits} />}

				{isMobile && (
					<div className={classes.singlesSpaceLocation}>
						<Typography className={classes.singleSpaceAddress} component="h1">
							<LocationOnIcon className={classes.mapMarkerIcon} />
							<AddressString
								variant="caption"
								component="span"
								addressString={`${space.venue.address ? space.venue.address : ''} ${
									space.venue.address2 ? space.venue.address2 : ''
								}`}
							/>
						</Typography>
						<Typography className={classes.spaceFarFrom}>
							<NearMeIcon className={classes.distanceIcon} />
							{distanceFromTo(
								userLocation?.countryCode || DEFAULT_LOCATION.countryCode,
								{
									latitude: userLocation?.latitude || DEFAULT_LOCATION.latitude,
									longitude: userLocation?.longitude || DEFAULT_LOCATION.longitude,
								},
								{ latitude, longitude }
							)}
						</Typography>
					</div>
				)}

				{!isMobile && (
					<div className={classes.singlesSpaceLocation}>
						<a
							rel="noopener noreferrer"
							target="_blank"
							href={getVenueDirectionsUrl(space.venue.address)}
							style={{ textDecoration: 'none' }}
						>
							<Typography className={classes.singleSpaceAddress} component="h1">
								<LocationOnIcon className={classes.mapMarkerIcon} />
								<AddressString
									variant="caption"
									component="span"
									addressString={`${space.venue.address ? space.venue.address : ''} ${
										space.venue.address2 ? space.venue.address2 : ''
									}`}
								/>
							</Typography>
						</a>
						<a
							rel="noopener noreferrer"
							target="_blank"
							href={getVenueDirectionsUrl(space.venue.address)}
							style={{ textDecoration: 'none' }}
						>
							<Typography className={classes.spaceFarFrom}>
								<NearMeIcon className={classes.distanceIcon} />
								{distanceFromTo(
									userLocation?.countryCode || DEFAULT_LOCATION.countryCode,
									{
										latitude: userLocation?.latitude || DEFAULT_LOCATION.latitude,
										longitude: userLocation?.longitude || DEFAULT_LOCATION.longitude,
									},
									{ latitude, longitude }
								)}
							</Typography>
						</a>
					</div>
				)}
			</Grid>

			<Grid item xs={12} className={classes.sectionWrapDivider}>
				<Grid container>
					{isMobile && (
						<>
							{space.spaceType.logicType !== SpaceTypeLogicType.INFO && (
								<Grid item xs={12}>
									<div className={classes.spacePriceHolder}>
										<SpacePriceComponent space={space} className={classes.spaceSliderPrice} />
									</div>
								</Grid>
							)}

							{space.spaceType.logicType === SpaceTypeLogicType.EVENT && (
								<>
									<Grid item xs={12} style={{ paddingLeft: 20 }}>
										<Typography className={classes.spaceTypeTitle} style={{ paddingLeft: 0, marginLeft: 0 }}>
											Event date:
										</Typography>
									</Grid>
									<Grid item xs={12} className={classes.spaceDetailsType} style={{ paddingLeft: 20 }}>
										<Typography>
											<EventDateComponent space={space} />
										</Typography>
									</Grid>
								</>
							)}

							{space.spaceType.logicType !== SpaceTypeLogicType.INFO && !isFromMembership && (
								<Link
									to={`/venue/${space.venue.alias}/${space.venue.address}`}
									className={classes.spaceTopView}
									style={{ marginLeft: 20, marginTop: 10, marginRight: 0 }}
								>
									<VisibilityIcon />
									<Typography>View all packages at this location</Typography>
								</Link>
							)}
							<ShareComponent space={space} />
							{space.spaceType.logicType === SpaceTypeLogicType.INFO && (
								<Typography style={{ fontSize: 14, marginTop: 30, width: '100%' }} className={classes.spaceDetailsType}>
									<b>
										<HelpOutlineIcon className={classes.textIcon} /> Is this your space?{' '}
										<a href="https://drop-desk.com/host">Claim</a> this listing
									</b>
								</Typography>
							)}
							<Typography style={{ fontSize: 14, marginTop: 30 }} className={classes.spaceDetailsType}>
								Full refund if you cancel 24 hours before the reservation start time
							</Typography>
						</>
					)}
					<Grid item xs={12} md={7}>
						<Grid container>
							<Grid item xs={12}>
								<Typography className={classes.spaceTypeTitle}>Hours of Operation</Typography>
							</Grid>
							<Grid item xs={12} className={classes.spaceDetailsType}>
								<SpaceAccessHoursListComponent space={space} />
							</Grid>

							<Grid item xs={12}>
								<Typography className={classes.spaceTypeTitle}>About venue</Typography>
							</Grid>
							<Grid item xs={12} className={classes.spaceDetailsType}>
								<ReadMoreComponent text={space.venue.description} min={80} ideal={100} max={200} readMoreText="...read more" />
							</Grid>
						</Grid>

						{space.spaceType.logicType !== SpaceTypeLogicType.INFO && (
							<Grid container>
								<Grid item xs={12}>
									<Typography className={classes.spaceTypeTitle}>Features</Typography>
								</Grid>
								<SpaceFeaturesComponent space={space} />
							</Grid>
						)}
					</Grid>
					<Grid item xs={12} md={5}>
						<Grid container>
							{!isMobile && (
								<>
									{space.spaceType.logicType === SpaceTypeLogicType.EVENT && (
										<>
											<Grid item xs={12}>
												<Typography className={classes.spaceTypeTitle} style={{ paddingLeft: 0, marginLeft: 0 }}>
													Event date:
												</Typography>
											</Grid>
											<Grid item xs={12} className={classes.spaceDetailsType} style={{ paddingLeft: 0 }}>
												<Typography>
													<EventDateComponent space={space} />
												</Typography>
											</Grid>
										</>
									)}
									{space.spaceType.logicType !== SpaceTypeLogicType.INFO && (
										<Grid item xs={12}>
											<div className={classes.spacePriceHolder}>
												<SpacePriceComponent space={space} className={classes.spaceSliderPrice} />
											</div>
										</Grid>
									)}
								</>
							)}
							<Grid item xs={12}>
								<SpaceButtonsComponent space={space} />

								{!isMobile && (
									<>
										{space.spaceType.logicType !== SpaceTypeLogicType.INFO && !isFromMembership && (
											<Link to={`/venue/${space.venue.alias}/${space.venue.address}`} className={classes.spaceTopView}>
												<VisibilityIcon />
												<Typography>View all packages at this location</Typography>
											</Link>
										)}

										<ShareComponent space={space} />

										{space.spaceType.logicType === SpaceTypeLogicType.INFO && (
											<Typography style={{ fontSize: 14, marginTop: 50 }} className={classes.rightText}>
												<b>
													<HelpOutlineIcon className={classes.textIcon} /> Is this your space?{' '}
													<a href="https://drop-desk.com/host">Claim</a> this listing
												</b>
											</Typography>
										)}
										<Typography style={{ fontSize: 14, marginTop: 50 }} className={classes.rightText}>
											Full refund if you cancel 24 hours before the reservation start time
										</Typography>
									</>
								)}
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>

			<Grid item xs={12} className={classes.sectionWrapDivider}>
				<Grid container>
					<Grid item xs={12} md={7}>
						{space.description && (
							<>
								<Typography className={classes.spaceTypeTitle}>Space description</Typography>
								<div className={classes.spaceDetailsType}>
									<ReadMoreComponent text={space.description} min={80} ideal={100} max={200} readMoreText="...read more" />
								</div>
							</>
						)}
					</Grid>

					<Grid item xs={12} md={5}>
						<Typography className={classes.spaceTypeTitle}>Contact us</Typography>
						<ContactUsComponent space={space} />
					</Grid>
				</Grid>
			</Grid>

			<SpaceAmenityComponent amenities={space.amenities} currency={space.venue.currency} />

			{!!relatedParams && !isMobile && <RelatedSpaceComponent params={relatedParams} />}
		</Grid>
	);

	return (
		<EmptyPage>
			<Header />

			<MetaComponent
				title={space.name}
				image={space.photos.length ? space.photos[0].url : space.venue.photos![0].url}
				description={space.description}
			/>

			{isAuthenticated && !isFromMembership && !isMobile && <MainMenuComponent />}

			<Grid container spacing={0} className={rootHtmlClass}>
				<Grid item sm={7} xs={12}>
					{!isMobile && (
						<CustomScrollbar autoHide className={classes.spaceDetailsWrapper}>
							{mainBLock()}
						</CustomScrollbar>
					)}
					{isMobile && mainBLock()}
				</Grid>

				<Grid item sm={5} xs={12} className={classes.mapWrapper}>
					<GoogleMapsComponent points={markers} isSingleSpace />
				</Grid>

				{/* we have save container on mobile */}
				{!!relatedParams && isMobile && <RelatedSpaceComponent style={{ paddingBottom: 50 }} params={relatedParams} />}
			</Grid>
		</EmptyPage>
	);
}
