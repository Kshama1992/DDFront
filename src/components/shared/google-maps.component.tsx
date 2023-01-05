import React, { useEffect, useState } from 'react';
import { Theme, useTheme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import GoogleMapReact, { Maps } from 'google-map-react';
import Button from '@mui/material/Button';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DEFAULT_LOCATION } from '@context/auth.context';
import getVenueDirectionsUrl from '@helpers/space/venue-derections-url.helper';
import { GeolocationData } from '@helpers/geolocate.helper';
import { getAddressValue, getGoogleCity } from '@helpers/google-geocode.helper';
import AddressString from './address-string.component';

const mapMarkerStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			position: 'relative',
			bottom: 232,
			left: '-198px',
			width: 400,
			backgroundColor: 'white',
			boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
			padding: 10,
			fontSize: 14,
			zIndex: 100,
			'&:after': {
				top: '100%',
				left: '50%',
				border: 'solid transparent',
				content: `""`,
				height: 0,
				width: 0,
				position: 'absolute',
				pointerEvents: 'none',
				borderColor: 'rgba(255, 255, 255, 0)',
				borderTopColor: '#fff',
				borderWidth: 20,
				marginLeft: -20,
			},
		},
		iconWrapper: {
			backgroundColor: theme.palette.primary.main,
			width: 12,
			height: 12,
			left: -5,
			top: -12,
			position: 'relative',
			border: '3px solid white',
			borderRadius: '50%',
			boxShadow: '0 2px 10px #ccc',
		},
		icon: {
			width: 45,
			height: 45,
			left: -20,
			top: -40,
			position: 'relative',
			color: theme.palette.primary.main,
			fontSize: 45,
		},
		distanceIcon: {
			marginBottom: -2,
			marginRight: 5,
			fontSize: 12,
		},
		distanceText: {
			color: theme.palette.primary.main,
		},
		spaceImage: {
			width: theme.spacing(13),
			height: theme.spacing(13),
		},
		name: {
			fontSize: 17,
			fontWeight: 600,
			color: theme.palette.primary.dark,
			padding: 0,
			marginLeft: 0,
			textTransform: 'none',
		},
		address: {
			fontSize: 15,
			fontWeight: 400,
		},
		packageCount: {
			fontSize: 12,
			fontWeight: 300,
		},
	})
);

export interface GoogleMapPoint {
	id: number | undefined;
	lat: number;
	lng: number;
	name?: string;
	alias?: string;
	address?: string;
	show: boolean;
	hover: boolean;
	photo?: string;
	text?: string; // todo: check if using
	icon?: any; // todo: check if using
	packagesCount: number;
	distance: string;
	color?: string; // todo: check if using
}

interface GoogleMapsProps {
	isSingleSpace?: boolean;
	points: GoogleMapPoint[];
	onMarkerHover?: (key: string | null) => any;
	onVenueClick?: (key: number) => any;
	onCoordsChanged?: (bounds: google.maps.LatLngBounds | undefined, center: google.maps.LatLng, zoom: number) => any;
	onZoomChanged?: (bounds: google.maps.LatLngBounds | null | undefined, center: google.maps.LatLng | undefined, zoom: number) => any;
	initialLocation?: GeolocationData;
	reCenter?: boolean;
}

const InfoWindow = ({ place, onVenueClick }: { place: GoogleMapPoint; onVenueClick?: (key: any) => any }) => {
	const classes = mapMarkerStyles();
	const onTitleClick = () => {
		if (onVenueClick && place.id) onVenueClick(place.id);
	};
	return (
		<Grid container className={classes.root}>
			<Grid item xs={4}>
				<Avatar alt={place.name} src={place.photo} className={classes.spaceImage} />
			</Grid>
			<Grid item xs={8}>
				<Typography component={Button} onClick={onTitleClick} className={classes.name}>
					{place.name}
				</Typography>
				<AddressString className={classes.address} addressString={String(place.address)} />
				<Typography className={classes.packageCount}>({place.packagesCount} packages)</Typography>
			</Grid>
		</Grid>
	);
};

export const MarkerSimple = () => {
	const classes = mapMarkerStyles();
	return <LocationOnIcon className={classes.icon} />;
};

// Marker component
export const Marker = ({
	show,
	item,
	hover,
	onVenueClick,
	isSingleSpace = false,
}: {
	show: boolean;
	item: GoogleMapPoint;
	hover: boolean;
	onVenueClick: any;
	isSingleSpace: boolean;
}) => {
	const theme = useTheme();
	const classes = mapMarkerStyles();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });

	return (
		<>
			{!isSingleSpace && (
				<>
					{(show || hover) && <LocationOnIcon className={classes.icon} />}
					{!show && !hover && !isSingleSpace && <div className={classes.iconWrapper} />}
					{show && <InfoWindow place={item} onVenueClick={onVenueClick} />}
				</>
			)}
			{isSingleSpace && (
				<>
					{isMobile && (
						<a target="_blank" href={getVenueDirectionsUrl(item.address!)} style={{ textDecoration: 'none' }} rel="noreferrer">
							<LocationOnIcon className={classes.icon} />
						</a>
					)}
					{!isMobile && <LocationOnIcon className={classes.icon} />}
				</>
			)}
		</>
	);
};

const getGoogleCountry = (input: google.maps.GeocoderResult[]) => input.filter((i: google.maps.GeocoderResult) => i.types[0] === 'country')[0];
const getGoogleState = (input: google.maps.GeocoderResult[]) =>
	input.filter((i: google.maps.GeocoderResult) => i.types[0] === 'administrative_area_level_1')[0];

const getViewPort = async (params: {
	address?: string | undefined;
	location?: { lat: any; lng: any } | undefined;
}): Promise<{
	country: google.maps.GeocoderResult;
	state: google.maps.GeocoderResult | undefined;
	city: google.maps.GeocoderResult | undefined;
	country_name: string;
}> => {
	const geocoder = new google.maps.Geocoder();

	return new Promise((resolve) => {
		geocoder.geocode(params, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
			if (status === google.maps.GeocoderStatus.OK) {
				resolve({
					country_name: getAddressValue(results[0].address_components, 'country', 'long_name'),
					country: getGoogleCountry(results),
					state: getGoogleState(results),
					city: getGoogleCity(results),
				});
			} else {
				resolve({
					country_name: '',
					country: getGoogleCountry(results),
					state: undefined,
					city: undefined,
				});
			}
		});
	});
};

function GoogleMapsComponent({
	points,
	onMarkerHover,
	onVenueClick,
	isSingleSpace = false,
	onCoordsChanged,
	onZoomChanged,
	initialLocation,
	reCenter = true,
}: GoogleMapsProps) {
	const [places, setPlaces] = useState<GoogleMapPoint[]>([]);

	let defaultZoom = 6;
	if (isSingleSpace) defaultZoom = 16;

	const getMapOptions = () => ({
		disableDefaultUI: true,
		mapTypeControl: false,
		streetViewControl: false,
	});

	let defaultCenter = { lat: DEFAULT_LOCATION.latitude, lng: DEFAULT_LOCATION.longitude };

	if (initialLocation) {
		defaultCenter = { lat: initialLocation.latitude, lng: initialLocation.longitude };
	}

	if (isSingleSpace && points.length) defaultCenter = { lat: points[0].lat, lng: points[0].lng };

	const getFilteredLocation = (loc: GeolocationData) => ({
		city: loc.city,
		state: loc.state,
		country: loc.country,
		radius: loc.radius,
		latitude: loc.latitude,
		longitude: loc.longitude,
	});
	const [oldLocation, setOldLocation] = useState<GeolocationData | undefined>(initialLocation ? getFilteredLocation(initialLocation) : undefined);
	const [initialed, setInitialed] = useState<boolean>(false);
	const [oldZoom, setOldZoom] = useState<number | undefined>(defaultZoom);
	const [map, setMap] = useState<google.maps.Map | undefined>();
	const [maps, setMaps] = useState<Maps | undefined>();

	const getMapBounds = (inputMap: any, inputMaps: any, inputPlaces: any) => {
		const bounds = new inputMaps.LatLngBounds();

		inputPlaces.forEach((place: any) => {
			bounds.extend(new inputMaps.LatLng(place.lat, place.lng));
		});
		return bounds;
	};

	const codeAddress = (geometry: google.maps.GeocoderGeometry, inputMap: google.maps.Map | undefined) => {
		if (!inputMap) return;
		if (geometry.viewport) {
			inputMap.setCenter(geometry.location);
			inputMap.fitBounds(geometry.viewport, 0);
		} else if (geometry.bounds) {
			inputMap.setCenter(geometry.location);
			inputMap.fitBounds(geometry.bounds, 0);
		} else {
			inputMap.panTo(geometry.location);
		}
		setOldZoom(inputMap.getZoom() || defaultZoom);
	};

	const changeViewPortByAddress = (inputMap: google.maps.Map | undefined, inputMaps: Maps | undefined) => {
		if (initialLocation && inputMap) {
			const newLocation = getFilteredLocation(initialLocation);

			if (JSON.stringify(oldLocation) === JSON.stringify(newLocation)) return;

			getViewPort({ address: `${initialLocation.country} ${initialLocation.state || ''} ${initialLocation.city || ''}` }).then((s) => {
				let geometry;
				if (initialLocation.country && s.country) {
					geometry = s.country.geometry;
				}
				if (initialLocation.state && s.state) {
					geometry = s.state.geometry;
				}
				if (initialLocation.city && s.city) {
					geometry = s.city.geometry;
				}

				if (geometry) {
					if (initialLocation.country === 'United States' && !initialLocation.state && points.length) {
						const bounds = getMapBounds(inputMap, inputMaps, points);
						inputMap.setCenter(bounds.getCenter());
						inputMap.panToBounds(bounds);
						inputMap.fitBounds(bounds);
					} else {
						codeAddress(geometry, inputMap);
					}
					setInitialed(true);
				}
			});
			setOldLocation(newLocation);
		}
	};

	useEffect(() => {
		if (typeof map === 'undefined' || typeof maps === 'undefined') return;
		setPlaces(points);
	}, [points, maps, map]);

	useEffect(() => {
		if (typeof map === 'undefined' || typeof maps === 'undefined' || typeof initialLocation === 'undefined') return;
		if (reCenter) changeViewPortByAddress(map, maps);
	}, [initialLocation, map, maps]);

	const apiIsLoaded = (inputMaps: { map: any; maps: any; ref: Element | null }) => {
		setMap(inputMaps.map);
		setMaps(inputMaps.maps);
		changeViewPortByAddress(inputMaps.map, inputMaps.maps);
	};

	const onMarkerClick = (venueId: string) => {
		setPlaces(
			places.map((p) => {
				const c = p;
				c.show = p.id === Number(venueId) ? !p.show : false;
				return c;
			})
		);
	};

	const onChildMouseEnter = (key: string) => {
		if (onMarkerHover) {
			onMarkerHover(key);
		}
	};

	const onDragEnd = (changedMap: any) => {
		const bounds = changedMap.getBounds();
		if (onCoordsChanged && changedMap && bounds) {
			onCoordsChanged(bounds, changedMap.getCenter(), changedMap.getZoom());
		}
	};

	const onChildMouseLeave = (/* key, childProps */) => {
		if (onMarkerHover) {
			onMarkerHover(null);
		}
	};

	const onMapChange = ({ zoom }: any) => {
		if (!map) return;
		if (initialed && zoom !== oldZoom) {
			if (onZoomChanged) onZoomChanged(map.getBounds(), map.getCenter(), map.getZoom() || defaultZoom);
			setOldZoom(zoom);
		}
	};

	return (
		// @ts-ignore
		<GoogleMapReact
			bootstrapURLKeys={{ key: `${process.env.RAZZLE_RUNTIME_GOOGLE_API_KEY}` }}
			defaultZoom={defaultZoom}
			center={defaultCenter}
			yesIWantToUseGoogleMapApiInternals
			onGoogleApiLoaded={apiIsLoaded}
			onChange={onMapChange}
			onDragEnd={onDragEnd}
			onChildClick={onMarkerClick}
			resetBoundsOnResize
			onChildMouseEnter={onChildMouseEnter}
			onChildMouseLeave={onChildMouseLeave}
			options={getMapOptions}
		>
			{places.map((p: GoogleMapPoint) => (
				<Marker
					onVenueClick={onVenueClick}
					// @ts-ignore
					lat={p.lat}
					isSingleSpace={isSingleSpace}
					lng={p.lng}
					item={p}
					hover={p.hover}
					show={p.show}
					key={p.id}
				/>
			))}
		</GoogleMapReact>
	);
}

export default GoogleMapsComponent;
