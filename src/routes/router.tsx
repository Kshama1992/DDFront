import React, { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import SpaceListPage from '@pages/space-list/space-list.page';
import getCommunityRoutes from './community.config';
import getDashboardRoutes from './dashboard.config';
import getLandingRoutes from './landing.config';
import PrivateRoute from './private.route';

const VenueListPage = lazy(() => import('@pages/venue-list/venue-list.page'));
const SignUpPage = lazy(() => import('@pages/sign-up/sign-up.page'));
const NotFoundPage = lazy(() => import('@pages/not-found.page'));
const TeamPage = lazy(() => import('@pages/team/team.page'));
const ProfilePage = lazy(() => import('@pages/profile/profile.page'));
const SettingsPage = lazy(() => import('@pages/settings/settings.page'));
const HistoryPage = lazy(() => import('@pages/history/history.page'));
const HistorySinglePage = lazy(() => import('@pages/history-single/history-single.page'));
const SpaceSinglePage = lazy(() => import('@pages/space-single/space-single.page'));
const PaymentMethodsPage = lazy(() => import('@pages/payment-methods/payment-methods.page'));
const ForgotPasswordPage = lazy(() => import('@pages/forgot-pass/forgot-pass.page'));
const ForgotPasswordConfirmPage = lazy(() => import('@pages/forgot-pass/forgot-pass-confirm.page'));
const SEOCountryStateSpaceTypePage = lazy(() => import('@pages/seo-pages/country-state-space_type.page'));
const SpaceCheckoutPage = lazy(() => import('@pages/space-checkout/space-checkout.page'));

export default function Router() {
	return useRoutes([
		{
			path: '/',
			element: <Navigate to="locations" />,
		},
		{
			path: 'locations/:country/:state/:city/:spaceType/:venue/:spaceSlug',
			element: <SpaceSinglePage />,
		},
		{
			path: 'locations',
			element: <SpaceListPage />,
			children: [
				{
					path: ':country',
					element: <SpaceListPage />,
				},
				{
					path: ':country/:state',
					element: <SpaceListPage />,
				},
				{
					path: ':country/:state/:city',
					element: <SpaceListPage />,
				},
				{
					path: ':country/:state/:city/:spaceTypeSlug',
					element: <SpaceListPage />,
				},
				{
					path: ':country/:state/:city/:spaceTypeSlug/:subSpaceTypeSlug',
					element: <SpaceListPage />,
				},
				{
					path: ':country/:spaceTypeSlug/:subSpaceTypeSlug',
					element: <SpaceListPage />,
				},
			],
		},
		{
			path: 'locations',
			element: <SpaceListPage />,
		},
		{
			path: 'venue/:venueAlias/:venueAddress',
			element: <VenueListPage />,
			children: [
				{
					path: ':spaceTypeSlug/:subSpaceTypeSlug',
					element: <VenueListPage />,
				},
			],
		},
		{
			path: 'sign',
			element: <SignUpPage />,
		},
		{
			path: 'forgot-password',
			element: <ForgotPasswordPage />,
		},
		{
			path: 'forgot-password-confirm/:token',
			element: <ForgotPasswordConfirmPage />,
		},
		{
			path: 'checkout',
			element: (
				<PrivateRoute>
					<SpaceCheckoutPage />
				</PrivateRoute>
			),
		},
		{
			path: 'membership/:spaceId',
			element: (
				<PrivateRoute>
					<SpaceSinglePage />
				</PrivateRoute>
			),
		},
		{
			path: 'profile/:id',
			element: (
				<PrivateRoute>
					<ProfilePage />
				</PrivateRoute>
			),
		},
		{
			path: 'team',
			element: (
				<PrivateRoute>
					<TeamPage />
				</PrivateRoute>
			),
			children: [
				{
					path: ':teamId',
					element: (
						<PrivateRoute>
							<TeamPage />
						</PrivateRoute>
					),
				},
			],
		},
		{
			path: 'settings',
			element: (
				<PrivateRoute>
					<SettingsPage />
				</PrivateRoute>
			),
		},
		{
			path: 'payment/methods',
			element: (
				<PrivateRoute>
					<PaymentMethodsPage />
				</PrivateRoute>
			),
		},
		{
			path: 'history/:type',
			element: (
				<PrivateRoute>
					<HistoryPage />
				</PrivateRoute>
			),
		},
		{
			path: 'history-details/:id',
			element: (
				<PrivateRoute>
					<HistorySinglePage />
				</PrivateRoute>
			),
		},
		...getDashboardRoutes(),
		...getLandingRoutes(),
		...getCommunityRoutes(),
		{
			path: '/:state?/:city/:district?/:spaceTypeSlug/:address?',
			element: <SEOCountryStateSpaceTypePage />,
		},
		{
			path: '*',
			element: <NotFoundPage />,
		},
	]);
}
