import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { parse as parseQueryString } from 'query-string';
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NearMeIcon from '@mui/icons-material/NearMe';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SpaceService from '@service/space.service';
import { AuthContext, DEFAULT_LOCATION } from '@context/auth.context';
import GoogleMapsComponent from '@shared-components/google-maps.component';
import CustomScrollbar from '@shared-components/custom-scrollbar.component';
import distanceFromTo from '@helpers/space/distance-from.helper';
import SpaceAccessHoursComponent from '@shared-components/space-access-hours.component';
import RelatedSpaceComponent from '@shared-components/related-spaces.component';
import SpaceAmenityComponent from '@shared-components/space-amenity.component';
import SpaceAccessHoursListComponent from '@shared-components/space-access-hours-list.component';
import getVenueDirectionsUrl from '@helpers/space/venue-derections-url.helper';
import ReadMoreComponent from '@shared-components/read-more.component';
import AddressString from '@shared-components/address-string.component';
import EmptyPage from '../empty.page';
import Header from '../../components/header/header.component';
import MainMenuComponent from '../../components/mainMenu/main-menu.component';
import SpaceSliderComponent from '../space-single/space-slider.component';
import MetaComponent from '../../components/meta.component';
import ContactUsComponent from '../space-single/contact-us.component';
import SpaceButtonsComponent from '../space-single/space-buttons.component';
import ShareComponent from '../space-single/share.component';
import SpaceFeaturesComponent from '../space-single/space-features.component';
import SpaceSinglePageStyle from '../space-single/style/space-single.page.style';
import SpacePriceComponent from '../../components/shared/space-price.component';

export default function SpaceCheckoutPage() {
	const classes = SpaceSinglePageStyle();
	const spaceService = new SpaceService();
	const { isAuthenticated, userLocation, authBody, userCheckins } = useContext(AuthContext);

	const [isLoading, setIsloading] = useState<boolean>(true);
	const [latitude, setLatitude] = useState<number>(DEFAULT_LOCATION.latitude);
	const [longitude, setLongitude] = useState<number>(DEFAULT_LOCATION.longitude);
	const [space, setSpace] = useState<SpaceInterface | undefined>();
	const [markers, setMarkers] = useState<any[]>([]);
	const [relatedParams, setRelatedParams] = useState<any | undefined>();
	// @ts-ignore
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'), { noSsr: false });
	const { search } = useLocation();

	const searchParams = parseQueryString(search);
	const isFromMembership = !!searchParams.isFromMembership;

	// eslint-disable-next-line no-nested-ternary
	const rootHtmlClass = isMobile ? classes.spacesPageMobile : isAuthenticated && !isFromMembership ? classes.spacesPage : classes.spacesPageGuest;

	const loadSpace = useCallback(
		async (id: any) => {
			if (!id) {
				setIsloading(false);
				return;
			}

			try {
				const data = await spaceService.single(id);
				setSpace(data);

				const [long, lat] = data.venue.coordinates.coordinates;

				setLatitude(lat);
				setLongitude(long);

				setRelatedParams({
					venueId: data.venueId,
					excludeIds: [id],
					longitude: long,
					latitude: lat,
					limit: 10,
				});

				setMarkers([
					{
						lat,
						lng: long,
						id: data.venue.id,
						packagesCount: 1,
						show: false,
						hover: false,
						name: data.venue.name,
						text: data.venue.name,
						// text: `${space.name} - ${space.venue.name}`,
						icon: <LocationOnIcon />,
						color: data.spaceType.color || '#2F96E6',
						distance: distanceFromTo(
							userLocation?.countryCode || DEFAULT_LOCATION.countryCode,
							{
								latitude: userLocation?.latitude || DEFAULT_LOCATION.latitude,
								longitude: userLocation?.longitude || DEFAULT_LOCATION.longitude,
							},
							{ latitude: lat, longitude: long }
						),
						venue: data.venue,
					},
				]);

				setIsloading(false);
			} catch (e) {
				console.error(e);
			} finally {
				setIsloading(false);
			}
		},
		[userCheckins]
	);

	useEffect(() => {
		if (!isAuthenticated && !authBody) setIsloading(false);
	}, []);

	useEffect(() => {
		if (userCheckins.length > 0) loadSpace(userCheckins[0].spaceId).then();
		else setIsloading(false);
	}, [userCheckins]);

	if (isLoading) return <LinearProgress />;

	const mainBLock = () => {
		if (!space) return '';
		return (
			<Grid container spacing={0} style={{ overflow: 'hidden' }}>
				<Grid item xs={12}>
					<SpaceSliderComponent isCheckin space={space} />
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
							<a target="_blank" href={getVenueDirectionsUrl(space.venue.address)} style={{ textDecoration: 'none' }} rel="noreferrer">
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
							<a target="_blank" href={getVenueDirectionsUrl(space.venue.address)} style={{ textDecoration: 'none' }} rel="noreferrer">
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
						<Grid item xs={12} md={7}>
							<Grid container>
								{isMobile && (
									<>
										<Grid item xs={12}>
											<div className={classes.spacePriceHolder}>
												<SpacePriceComponent space={space} className={classes.spaceSliderPrice} />
											</div>
										</Grid>
										<Link
											to={`/venue/${space.venue.alias}/${space.venue.address}`}
											className={classes.spaceTopView}
											style={{ marginLeft: 20, marginTop: 10, marginRight: 0 }}
										>
											<VisibilityIcon />
											<Typography>View all packages at this location</Typography>
										</Link>
										<ShareComponent space={space} />
										<Typography style={{ fontSize: 14, marginTop: 30 }} className={classes.spaceDetailsType}>
											Full refund if you cancel 24 hours before the reservation start time
										</Typography>
									</>
								)}

								{space.venue.specialInstructions && (
									<Grid item xs={12} md={12}>
										<Typography className={classes.spaceTypeTitle}>Getting started instructions</Typography>
										<div className={classes.spaceDetailsType}>
											<Typography>{space.venue.specialInstructions}</Typography>
										</div>
									</Grid>
								)}

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
							{!isMobile && (
								<div className={classes.spacePriceHolder}>
									<SpacePriceComponent space={space} className={classes.spaceSliderPrice} />
								</div>
							)}

							<SpaceButtonsComponent space={space} />

							{!isMobile && (
								<>
									<Link to={`/venue/${space.venue.alias}/${space.venue.address}`} className={classes.spaceTopView}>
										<VisibilityIcon />
										<Typography>View all packages at this location</Typography>
									</Link>
									<ShareComponent space={space} />
									<Typography style={{ fontSize: 14, marginTop: 50 }} className={classes.rightText}>
										Full refund if you cancel 24 hours before the reservation start time
									</Typography>
								</>
							)}
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={12} className={classes.sectionWrapDivider}>
					<Grid container>
						<Grid item xs={12} md={7}>
							<Typography className={classes.spaceTypeTitle}>Space description</Typography>
							<div className={classes.spaceDetailsType}>
								<Typography>
									<ReadMoreComponent text={space.description} min={80} ideal={100} max={200} readMoreText="...read more" />
								</Typography>
							</div>
						</Grid>

						<Grid item xs={12} md={5}>
							<Typography className={classes.spaceTypeTitle}>Contact us</Typography>
							<ContactUsComponent space={space} />
						</Grid>
					</Grid>
				</Grid>

				<SpaceAmenityComponent amenities={space.amenities} currency={space.venue.currency} />

				{/* we have save container on mobile */}
				{!!relatedParams && !isMobile && <RelatedSpaceComponent params={relatedParams} />}
			</Grid>
		);
	};

	return (
		<EmptyPage>
			<Header />

			{space && userCheckins.length > 0 && (
				<MetaComponent title={space.name} image={space.photos?.length > 0 ? space.photos[0].url : space.venue.photos![0].url} />
			)}

			{isAuthenticated && !isFromMembership && !isMobile && <MainMenuComponent />}

			<Grid container spacing={0} className={rootHtmlClass}>
				<Grid item sm={7} xs={12}>
					{(!isAuthenticated || userCheckins.length === 0) && (
						<>
							<NotListedLocationIcon className={classes.locationIcon} />
							<Typography className={classes.locationText}>Looks like you are not checked in anywhere.</Typography>
							<Button to="/locations?nearBy=true" component={Link} className={classes.actionLink}>
								Search nearby spaces.
							</Button>
						</>
					)}

					{userCheckins.length > 0 && (
						<>
							{isMobile && (
								<CustomScrollbar autoHide className={classes.spaceDetailsWrapper}>
									{mainBLock()}
								</CustomScrollbar>
							)}

							{!isMobile && mainBLock()}
						</>
					)}
				</Grid>

				<Grid item sm={5} xs={12} className={classes.mapWrapper}>
					<GoogleMapsComponent isSingleSpace points={markers} />
				</Grid>

				{/* we have save container on mobile */}
				{!!relatedParams && isMobile && <RelatedSpaceComponent style={{ paddingBottom: 50 }} params={relatedParams} />}
			</Grid>
		</EmptyPage>
	);
}
