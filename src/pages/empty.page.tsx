import React from 'react';
import SystemSnackbarComponent from '@shared-components/system-snackbar.component';
import RoleRedirectComponent from '@pages/role-redirect.component';

export default function EmptyPage({ children }: any) {
	return (
		<>
			<RoleRedirectComponent />
			{children}

			<SystemSnackbarComponent />
		</>
	);
}
