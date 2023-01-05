import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GeolocationData } from '@helpers/geolocate.helper';
import GoogleMapsComponent, { GoogleMapPoint } from '@shared-components/google-maps.component';

export default function SpaceListMap({
	spaceMarkers = [],
	onMarkerClick,
	onCoordsChanged,
	onZoomChanged,
	initialLocation,
	reCenter = true,
}: {
	spaceMarkers?: GoogleMapPoint[];
	initialLocation?: GeolocationData;
	onMarkerClick?: (venueId: number) => void;
	onCoordsChanged?: (bounds: google.maps.LatLngBounds | undefined, center: google.maps.LatLng, zoom: number) => any;
	onZoomChanged?: (bounds: google.maps.LatLngBounds | null | undefined, center: google.maps.LatLng | undefined, zoom: number) => any;
	reCenter?: boolean;
}) {
	const navigate = useNavigate();

	const handleMarkerClick = (venueId: number) => {
		const marker = spaceMarkers.find((m: GoogleMapPoint) => m.id === venueId);

		if (marker) {
			const url = `/venue/${marker.alias}/${marker.address}`;
			navigate(url);
		}
		if (onMarkerClick) onMarkerClick(venueId);
	};

	return (
		<GoogleMapsComponent
			points={spaceMarkers}
			onVenueClick={handleMarkerClick}
			initialLocation={initialLocation}
			onCoordsChanged={onCoordsChanged}
			onZoomChanged={onZoomChanged}
			reCenter={reCenter}
		/>
	);
}
