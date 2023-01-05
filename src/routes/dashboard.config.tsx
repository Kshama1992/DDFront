import React, { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import getCommunityRoutes from './community.config';
import PrivateRoute from './private.route';

const LogEmailPage = lazy(() => import('@pages/log-email/log-email.page'));
const LogEmailSinglePage = lazy(() => import('@pages/log-email/log-email-single.page'));
const LogPage = lazy(() => import('@pages/log/log.page'));
const LogFilePage = lazy(() => import('@pages/log/log-file.page'));
const TeamPage = lazy(() => import('@pages/team/team.page'));
const TeamEditPage = lazy(() => import('@pages/team-admin/team-edit.page'));
const TeamAdminPage = lazy(() => import('@pages/team-admin/team-admin.page'));
const RolePage = lazy(() => import('@pages/role/role.page'));
const RoleEditPage = lazy(() => import('@pages/role/role-edit.page'));
const ProfilePage = lazy(() => import('@pages/profile/profile.page'));
const BrandPage = lazy(() => import('@pages/brand/brand.page'));
const BrandEditPage = lazy(() => import('@pages/brand/brand-edit.page'));
const SettingsPage = lazy(() => import('@pages/settings/settings.page'));
const ActivityPage = lazy(() => import('@pages/activity/activity.page'));
const SpaceTypePage = lazy(() => import('@pages/space-type/space-type.page'));
const SpaceEditPage = lazy(() => import('@pages/space-edit/space-edit.page'));
const VenueEditPage = lazy(() => import('@pages/venue-edit/venue-edit.page'));
const VenueTypePage = lazy(() => import('@pages/venue-type/venue-type.page'));
const EmailTemplatesPage = lazy(() => import('@pages/email-templates/email-templates.page'));
const EmailTemplateEditPage = lazy(() => import('@pages/email-template-edit/email-template-edit.page'));
const EmailTemplateTypePage = lazy(() => import('@pages/email-template-type/email-template-type.page'));
const EmailTemplateTypeEditComponent = lazy(() => import('@pages/email-template-type/email-template-type-edit.page'));

export default function getDashboardRoutes(): RouteObject[] {
	return [
		{
			path: 'dashboard',
			element: (
				<PrivateRoute>
					<Navigate to="dashboard/activity" />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/activity',
			element: (
				<PrivateRoute>
					<ActivityPage />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/venue/:venueId/space/:spaceId',
			element: (
				<PrivateRoute>
					<SpaceEditPage />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/venue/:venueId',
			element: (
				<PrivateRoute>
					<VenueEditPage />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/email-templates/:templateId',
			element: (
				<PrivateRoute>
					<EmailTemplateEditPage />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/email-templates',
			element: (
				<PrivateRoute>
					<EmailTemplatesPage />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/role/:roleId',
			element: (
				<PrivateRoute>
					<RoleEditPage />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/role',
			element: (
				<PrivateRoute>
					<RolePage />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/team-admin',
			element: (
				<PrivateRoute>
					<TeamAdminPage />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/team-admin/:teamId',
			element: (
				<PrivateRoute>
					<TeamEditPage />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/email-template-type/:typeId',
			element: (
				<PrivateRoute>
					<EmailTemplateTypeEditComponent />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/email-template-type',
			element: (
				<PrivateRoute>
					<EmailTemplateTypePage />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/log',
			element: (
				<PrivateRoute>
					<LogPage />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/log/:logType/:fileName',
			element: (
				<PrivateRoute>
					<LogFilePage />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/log-email',
			element: (
				<PrivateRoute>
					<LogEmailPage />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/log-email/:emailLogId',
			element: (
				<PrivateRoute>
					<LogEmailSinglePage />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/brand/:brandId',
			element: (
				<PrivateRoute>
					<BrandEditPage />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/brand',
			element: (
				<PrivateRoute>
					<BrandPage />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/space-type/:spaceTypeId',
			element: (
				<PrivateRoute>
					<SpaceTypePage />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/space-type',
			element: (
				<PrivateRoute>
					<SpaceTypePage />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/venue-type',
			element: (
				<PrivateRoute>
					<VenueTypePage />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/settings',
			element: (
				<PrivateRoute>
					<SettingsPage />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/profile/:id',
			element: (
				<PrivateRoute>
					<ProfilePage />
				</PrivateRoute>
			),
		},
		{
			path: 'dashboard/team',
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
		...getCommunityRoutes(true),
	];
}
