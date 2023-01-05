// import { generatePath } from 'react-router-dom';
// import SpaceInterface from '../../interface/space.interface';
// import generateSlug from '../slug.helper';
// import VenueInterface from 'dd-common-blocks/dist/interface/venue.interface';

export default function getVenueDirectionsUrl(addressString: string) {
	// return generatePath('/locations/:spaceType/:country/:state/:city/:venue', {
	// 	spaceType: generateSlug(space.spaceType.name),
	// 	country: space.venue.country ? generateSlug(space.venue.country) : 'no-country',
	// 	state: space.venue.state || space.venue.city ? generateSlug(space.venue.state || space.venue.city) : 'no-state',
	// 	city: space.venue.city ? generateSlug(space.venue.city) : 'no-city',
	// 	venue: space.venue.alias,
	// });

	return `https://www.google.com/maps/place/${addressString}`;
}
