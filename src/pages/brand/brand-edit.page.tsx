import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Theme, useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import BrandInterface from 'dd-common-blocks/dist/interface/brand.interface';
import { Helmet } from 'react-helmet';
import FormBrandComponent from '@forms/form-brand.component';
import BrandService from '@service/brand.service';
import BasePage from '../base.page';
import BreadcrumbsComponent from '../../components/breadcrumbs.component';

const useStyles = makeStyles((theme: Theme) =>
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
			maxWidth: 350,
			position: 'fixed',
			width: 350,
			zIndex: 1,
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				width: '100%',
				position: 'relative',
				paddingRight: 24,
			},
		},
		rightSide: {
			marginLeft: 350,
			width: 'calc(100% - 350px)',
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				marginLeft: 0,
				paddingRight: 24,
			},
		},
		formWrapper: {
			padding: 25,
		},
	})
);

export default function BrandEditPage() {
	const theme = useTheme();
	const classes = useStyles({});
	const brandService = new BrandService();
	const { brandId } = useParams();

	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;

	const [loading, setLoading] = useState(brandId !== '0');
	const [brandData, setBrandData] = useState<BrandInterface>();

	const loadBrand = useCallback(async () => {
		const data = await brandService.single(brandId);
		setBrandData(data);
		setLoading(false);
	}, []);

	useEffect(() => {
		if (brandId !== '0') {
			loadBrand().then();
		}
	}, []);

	return (
		<BasePage>
			<Helmet>
				<title>{`Brand ${loading || !brandData ? ' create' : ` edit - ${brandData.name}`}`}</title>
				<meta name="description" content="Brand" />
			</Helmet>

			<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
				<Grid item xs={12} md={9} xl={10} className={classes.rightSide}>
					<Grid container spacing={3}>
						<Grid item sm={12} xs={12} style={{ position: 'relative' }}>
							<BreadcrumbsComponent
								primary={`${brandId !== '0' ? 'Edit' : 'Add'} a brand:`}
								secondary={brandId !== '0' && brandData ? brandData.name : ''}
							/>
						</Grid>
						<Grid item lg={10} md={12} xs={12}>
							{loading && <LinearProgress />}
							{!loading && <FormBrandComponent initialValues={brandData} />}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</BasePage>
	);
}
