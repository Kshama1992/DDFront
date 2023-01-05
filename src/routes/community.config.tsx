import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import PrivateRoute from './private.route';

const CommunityPage = lazy(() => import('@pages/community/community.page'));
const CommunityMemberSinglePage = lazy(() => import('@pages/community/member/community-member-single.page'));
const CommunityCompanySinglePage = lazy(() => import('@pages/community/company/community-company-single.page'));
const CommunityGroupSinglePage = lazy(() => import('@pages/community/group/community-group-single.page'));
const CommunityMemberInvoiceListPage = lazy(() => import('@pages/community/member/community-member-invoice-list.page'));

export default function getCommunityRoutes(isAdmin?: boolean): RouteObject[] {
	return [
		{
			path: `${isAdmin ? '/dashboard' : ''}/community/:type`,
			element: (
				<PrivateRoute>
					<CommunityPage />
				</PrivateRoute>
			),
		},
		{
			path: `${isAdmin ? '/dashboard' : ''}/community/companies/:id`,
			element: (
				<PrivateRoute>
					<CommunityCompanySinglePage />
				</PrivateRoute>
			),
		},
		{
			path: `${isAdmin ? '/dashboard' : ''}/community/members/:id/invoices/:type`,
			element: (
				<PrivateRoute>
					<CommunityMemberInvoiceListPage />
				</PrivateRoute>
			),
		},
		{
			path: `${isAdmin ? '/dashboard' : ''}/community/members/:id`,
			element: (
				<PrivateRoute>
					<CommunityMemberSinglePage />
				</PrivateRoute>
			),
		},
		{
			path: `${isAdmin ? '/dashboard' : ''}/community/groups/:id`,
			element: (
				<PrivateRoute>
					<CommunityGroupSinglePage />
				</PrivateRoute>
			),
		},
	];
}
