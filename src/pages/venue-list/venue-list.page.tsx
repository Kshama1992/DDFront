import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VenueInterface from 'dd-common-blocks/dist/interface/venue.interface';
import { SpaceFiltersProvider } from '@context/space-filters.context';
import VenueService from '@service/venue.service';
import SpaceListComponent from '../space-list/space-list.component';

function VenueListPageInner() {
	const { venueAlias, venueAddress } = useParams();
	const [venue, setVenue] = useState<VenueInterface | undefined>();
	const [loading, setLoading] = useState(true);

	const venueService = new VenueService();

	const loadVenue = useCallback(async () => {
		setLoading(true);
		const [data] = await venueService.list({ alias: venueAlias, limit: 1 });
		setVenue(data[0]);
		setLoading(false);
	}, [venueAlias]);

	useEffect(() => {
		loadVenue().then();
	}, []);

	if (loading || !venue) return <></>;
	return (
		<SpaceListComponent
			pageType="venue"
			venueName={venue.name}
			metaDescription={venue.description}
			metaImage={venue.logo?.url}
			defaultProps={{ spaceTypeIds: [], country: venue.country, state: venue.state, city: venue.city, address: venueAddress }}
		/>
	);
}

export default function VenueListPage() {
	return (
		<SpaceFiltersProvider>
			<VenueListPageInner />
		</SpaceFiltersProvider>
	);
}
