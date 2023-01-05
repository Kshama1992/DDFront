import React from 'react';
import { useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Helmet } from 'react-helmet';
import BasePage from '../base.page';
import BreadcrumbsComponent from '../../components/breadcrumbs.component';
import SpaceTypeListComponent from './space-type-list.component';

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
		leftSide: {
			maxWidth: 300,
		},
		rightSide: {
			width: 'calc(100% - 300px)',
		},
		pageTop: {
			height: '50px',
			paddingLeft: '30px !important',
			background: '#dddee0',
		},
	})
);

export default function SpaceTypePage() {
	const theme = useTheme();
	const classes = useStyles({});

	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;

	return (
		<BasePage>
			<Helmet>
				<title>Email Templates</title>
				<meta name="description" content="Email Templates" />
			</Helmet>

			<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
				<Grid item sm={12} xs={12}>
					<BreadcrumbsComponent primary="Space types" />
				</Grid>

				<Grid item xs={12} md={9} xl={10} className={classes.rightSide}>
					<Grid container spacing={3}>
						<Grid item lg={12} md={12} xs={12}>
							<Paper>
								<SpaceTypeListComponent />
							</Paper>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</BasePage>
	);
}
