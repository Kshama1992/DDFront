import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import RoleRedirectComponent from '@pages/role-redirect.component';
import SystemSnackbarComponent from '@shared-components/system-snackbar.component';
import MainMenuComponent from '../components/mainMenu/main-menu.component';
import Header from '../components/header/header.component';

export default function BasePage({ children }: any) {
	// @ts-ignore
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'), { noSsr: false });

	return (
		<>
			<RoleRedirectComponent />
			<Header />
			{!isMobile && <MainMenuComponent />}

			<div style={{ paddingTop: 70, background: '#efefef', minHeight: 'calc(100vh - 90px)' }}>{children}</div>

			<SystemSnackbarComponent />
		</>
	);
}
