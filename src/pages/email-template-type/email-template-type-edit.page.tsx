import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Theme, useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Helmet } from 'react-helmet';
import EmailTemplateTypeInterface from 'dd-common-blocks/dist/interface/email-template-type.interface';
import FormEmailTypeComponent from '@forms/form-email-type.component';
import EmailTemplateTypeService from '@service/email-template-type.service';
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
			},
		},
		rightSide: {
			marginLeft: 350,
			width: 'calc(100% - 350px)',
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				marginLeft: 0,
			},
		},
		formWrapper: {
			padding: 25,
		},
	})
);

export default function EmailTemplateTypeEditComponent() {
	const theme = useTheme();
	const classes = useStyles({});
	const { typeId } = useParams();
	const templateTypeService = new EmailTemplateTypeService();

	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;

	const [loading, setLoading] = useState(typeId !== '0');
	const [typeData, setTypeData] = useState<EmailTemplateTypeInterface>();

	const loadRole = useCallback(async () => {
		const data = await templateTypeService.single(typeId);
		setTypeData(data);
		setLoading(false);
	}, []);

	useEffect(() => {
		if (typeId !== '0') {
			loadRole().then();
		}
	}, []);

	return (
		<BasePage>
			<Helmet>
				<title>{`Email type ${loading || !typeData ? ' create' : ` edit - ${typeData.name}`}`}</title>
				<meta name="description" content="Email type" />
			</Helmet>

			<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
				<Grid item xs={12} md={9} xl={10} className={classes.rightSide}>
					<Grid container spacing={3}>
						<Grid item sm={12} xs={12} style={{ position: 'relative' }}>
							<BreadcrumbsComponent
								primary={`${typeId !== '0' ? 'Edit' : 'Add'} an email type:`}
								secondary={typeId !== '0' && typeData ? typeData.name : ''}
							/>
						</Grid>
						<Grid item lg={10} md={12} xs={12}>
							{loading && <LinearProgress />}
							{!loading && <FormEmailTypeComponent initialValues={typeData} />}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</BasePage>
	);
}
