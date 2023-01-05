import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const NearMePage = lazy(() => import('@pages/near-me/near-me.page'));

export default function getLandingRoutes(): RouteObject[] {
	return [
		{
			path: '/:spaceTypeSlug-near-me',
			element: <NearMePage />,
		},
	];
}
