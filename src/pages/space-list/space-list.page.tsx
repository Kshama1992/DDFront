import React, { useCallback, useContext, useEffect, useState } from 'react';
import { generateSlug } from 'dd-common-blocks';
import { useNavigate, useParams } from 'react-router-dom';
import SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import { SpaceFiltersContext, SpaceFiltersProvider } from '@context/space-filters.context';
import { AuthContext } from '@context/auth.context';
import { googleGeocodeHelper } from '@helpers/google-geocode.helper';
import { GeolocationData } from '@helpers/geolocate.helper';
import checkPermsHelper from '@helpers/checkPerms.helper';
import SpaceListComponent from './space-list.component';
import { getFirstMenuItem } from '../../components/mainMenu/main-menu.component';

function SpaceListPageInner() {
	const navigate = useNavigate();
	const { spaceTypeSlug, subSpaceTypeSlug, country, state, city } = useParams();
	const { userLocation, authBody } = useContext(AuthContext);
	const { spaceTypes } = useContext(SpaceFiltersContext);

	if (!spaceTypeSlug && !subSpaceTypeSlug && userLocation && !country) {
		let link = '';
		if (!city && userLocation.city) link = `${generateSlug(userLocation.city.toLowerCase())}/${link}`;
		if (!state && userLocation.state) link = `${generateSlug(userLocation.state.toLowerCase())}/${link}`;
		if (!country) link = `${generateSlug(userLocation.country.toLowerCase())}/${link}`;
		navigate(`/locations/${link}all/all`);
	}

	const [loading, setLoading] = useState(true);
	const [spaceTypeIds, setSpaceTypeIds] = useState<number[]>([]);
	const [geoData, setGeoData] = useState<GeolocationData | undefined>();

	if (authBody && !checkPermsHelper(['Customer Spaces'], [], authBody)) navigate(getFirstMenuItem(authBody).url);

	const loadSpaceType = useCallback(async () => {
		let parent;

		try {
			const temp = await googleGeocodeHelper({
				address: `${country || userLocation?.country} ${state || ''} ${city || ''}`,
			});
			setGeoData(temp);
		} catch (e) {
			console.error(e);
		}

		if (spaceTypeSlug && spaceTypeSlug === 'all') {
			setLoading(false);
			return;
		}

		if (spaceTypeSlug) {
			parent = spaceTypes.find((st: SpaceTypeInterface) => st.alias === spaceTypeSlug);
			if (parent && parent.children) setSpaceTypeIds(parent.children.map((st: SpaceTypeInterface) => Number(st.id)));
		}

		if (parent && subSpaceTypeSlug) {
			const child = parent.children?.find((st: SpaceTypeInterface) => st.alias === subSpaceTypeSlug);
			if (child) setSpaceTypeIds([Number(child.id)]);
		}

		setLoading(false);
	}, [spaceTypes, spaceTypeSlug, subSpaceTypeSlug]);

	useEffect(() => {
		loadSpaceType().then();
	}, [spaceTypes]);

	if (loading) return <></>;

	return (
		<SpaceListComponent
			pageType="locations"
			defaultProps={{
				spaceTypeIds,
				...geoData,
			}}
		/>
	);
}

export default function SpaceListPage() {
	return (
		<SpaceFiltersProvider>
			<SpaceListPageInner />
		</SpaceFiltersProvider>
	);
}
