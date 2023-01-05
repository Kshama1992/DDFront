import React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from 'react-router-dom';
import { BrandFiltersProvider } from '@context/brand-filters.context';
import { Helmet } from 'react-helmet';
import BasePage from '../base.page';
import BreadcrumbsComponent from '../../components/breadcrumbs.component';
import BrandListComponent from './brand-list.component';
import BrandSidebarFiltersComponent from './brand-sidebar.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		rootMobile: {
			width: '100%',
			height: '100%',
			margin: 0,
		},
		root: {
			width: 'calc(100% - 90px)',
			margin: 0,
			marginLeft: 90,
		},
		rightSide: {
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				marginLeft: 0,
				paddingRight: 24,
			},
		},
		leftSide: {
			maxWidth: 300,
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				width: '100%',
				position: 'relative',
				paddingRight: 24,
			},
		},
	})
);

export default function BrandPage() {
	const theme = useTheme();
	const classes = useStyles({});

	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;

	return (
		<BasePage>
			<Helmet>
				<title>Brands</title>
				<meta name="description" content="Brands" />
			</Helmet>

			<BrandFiltersProvider>
				<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
					<Grid item xs={12} md={2} xl={2} className={classes.leftSide}>
						<BrandSidebarFiltersComponent />
					</Grid>

					<Grid item xs={12} md={9} xl={10} className={classes.rightSide}>
						<Grid container spacing={3}>
							<Grid item sm={12} xs={12} style={{ position: 'relative' }}>
								<Grid container>
									<Grid item xs={6}>
										<BreadcrumbsComponent primary="Brands" />
									</Grid>

									<Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
										<Button variant="contained" color="primary" startIcon={<AddIcon />} component={Link} to="/dashboard/brand/0">
											Add Brand
										</Button>
									</Grid>
								</Grid>
							</Grid>
							<Grid item lg={12} md={12} xs={12}>
								<BrandListComponent />
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</BrandFiltersProvider>
		</BasePage>
	);
}
