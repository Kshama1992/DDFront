import React from 'react';
import RoleRedirectComponent from '@pages/role-redirect.component';
import SystemSnackbarComponent from '@shared-components/system-snackbar.component';
import HeaderLanding from '../components/header/header-landing.component';

export default function LandingPage({ children }: any) {
	return (
		<>
			<RoleRedirectComponent />
			<HeaderLanding />

			{children}

			<SystemSnackbarComponent />
		</>
	);
}
