import React, { useEffect, useState, createContext, useCallback } from 'react';
import SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import { GoogleMapPoint } from '@shared-components/google-maps.component';
import SpaceTypeService from '@service/space-type.service';
import LoadingComponent from '../../routes/loading.component';

interface SpaceFiltersContextInterface {
	spaceMarkers: GoogleMapPoint[];
	setSpaceMarkers: (s: any) => void;
	spaceTypes: SpaceTypeInterface[];
}

const SpaceFiltersContext = createContext<SpaceFiltersContextInterface>({} as SpaceFiltersContextInterface);

function SpaceFiltersProvider(props: any) {
	const { children } = props;
	const spaceTypeService = new SpaceTypeService();
	const [loaded, setLoaded] = useState<boolean>(false);

	const [spaceMarkers, setSpaceMarkers] = useState([]);
	const [spaceTypes, setSpaceTypes] = useState<SpaceTypeInterface[]>([]);

	const loadSpaceType = useCallback(async () => {
		const [data] = await spaceTypeService.list({ withChildren: true, withCache: true });
		setSpaceTypes(data);
		setLoaded(true);
	}, []);

	useEffect(() => {
		loadSpaceType().then();
	}, []);

	const value = { spaceMarkers, setSpaceMarkers, spaceTypes };

	if (!loaded) return <LoadingComponent />;
	return <SpaceFiltersContext.Provider value={value}>{children}</SpaceFiltersContext.Provider>;
}

export { SpaceFiltersContext, SpaceFiltersProvider };
