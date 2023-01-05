import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import { googleGeocodeHelper } from '@helpers/google-geocode.helper';
import { GeolocationData } from '@helpers/geolocate.helper';
import { SpaceFiltersContext, SpaceFiltersProvider } from '@context/space-filters.context';
import SpaceListComponent from '../space-list/space-list.component';

function SEOCountryStateSpaceTypePageInner() {
	const { spaceTypeSlug, city } = useParams();
	const routeParams: any = useParams();
	const navigate = useNavigate();
	const { spaceTypes } = useContext(SpaceFiltersContext);

	const [loading, setLoading] = useState(true);
	const [spaceType, setSpaceType] = useState<SpaceTypeInterface | undefined>();

	const [rendered, setRendered] = useState<boolean>(false);

	const [geoData, setGeoData] = useState<GeolocationData | undefined>();

	const loadSpaceType = useCallback(async () => {
		if (!spaceTypes.length) return;

		let parent;

		if (spaceTypeSlug) {
			parent = spaceTypes.find((st: SpaceTypeInterface) => st.alias === spaceTypeSlug);
			if (!parent) {
				parent = spaceTypes.find((st: SpaceTypeInterface) => st.children?.some((stc) => stc.alias === spaceTypeSlug));
				setSpaceType(parent);
				if (!parent) {
					navigate('/locations');
					return;
				}
			} else {
				setSpaceType(parent);
			}
		}

		const temp = await googleGeocodeHelper({ address: city });
		setGeoData(temp);
		setLoading(false);
		setRendered(true);
	}, [routeParams]);

	useEffect(() => {
		if (!rendered) loadSpaceType().then();
	}, [rendered]);

	if (loading || !spaceType) return <></>;

	return (
		<SpaceListComponent
			pageType="by-state"
			defaultProps={{
				...geoData,
				spaceTypeIds: spaceType && spaceType.children ? spaceType.children.map((st) => Number(st.id)) : [],
			}}
		/>
	);
}

export default function SEOCountryStateSpaceTypePage() {
	return (
		<SpaceFiltersProvider>
			<SEOCountryStateSpaceTypePageInner />
		</SpaceFiltersProvider>
	);
}
