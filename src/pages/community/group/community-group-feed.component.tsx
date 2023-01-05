import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CommunityFiltersContext } from '@context/community-filters.context';
import CommunityFeedListComponent from '../feed/community-feed-list.component';

export default function CommunityGroupFeedComponent() {
	const { id } = useParams();
	const { setCommunityFilters } = useContext(CommunityFiltersContext);

	const [isLoaded, setIsLoaded] = useState(false);
	useEffect(() => {
		setCommunityFilters({ type: 'groupId', payload: id });
		setIsLoaded(true);
	}, []);

	if (!isLoaded) return <></>;
	return <CommunityFeedListComponent />;
}
