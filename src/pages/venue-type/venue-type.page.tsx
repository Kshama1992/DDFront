import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Helmet } from 'react-helmet';
import { AuthContext } from '@context/auth.context';
import BasePage from '../base.page';
import BreadcrumbsComponent from '../../components/breadcrumbs.component';
import VenueTypeListComponent from './venue-type-list.component';
import { getFirstMenuItem } from '../../components/mainMenu/main-menu.component';

const useStyles = makeStyles(() =>
	createStyles({
		rootMobile: {
			width: '100%',
			height: '100%',
			margin: 0,
		},
		root: {
			width: 'calc(100% - 90px)',
			// height: '100%',
			margin: 0,
			marginLeft: 90,
		},
		rightSide: {
			width: 'calc(100% - 300px)',
		},
	})
);

export default function SpaceTypePage() {
	const theme = useTheme();
	const classes = useStyles({});
	const navigate = useNavigate();
	const { isSuperAdmin, authBody } = useContext(AuthContext);

	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;

	if (!isSuperAdmin) navigate(getFirstMenuItem(authBody).url);

	return (
		<BasePage>
			<Helmet>
				<title>Venue types</title>
				<meta name="description" content="Venue types" />
			</Helmet>

			<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
				<Grid item sm={12} xs={12}>
					<BreadcrumbsComponent primary="Venue types" />
				</Grid>

				<Grid item xs={12} md={9} xl={10} className={classes.rightSide}>
					<Grid container spacing={3}>
						<Grid item lg={12} md={12} xs={12}>
							<VenueTypeListComponent />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</BasePage>
	);
}
