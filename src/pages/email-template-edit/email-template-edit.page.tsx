import React, { useCallback, useEffect, useState } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import EmailTemplateInterface from 'dd-common-blocks/dist/interface/email-template.interface';
import FormEmailTemplateComponent from '@forms/form-email-template.component';
import EmailTemplateService from '@service/email-template.service';
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
			maxWidth: 300,
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				width: '100%',
				position: 'relative',
				paddingRight: 24,
			},
		},
		rightSide: {
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				width: '100%',
				position: 'relative',
				paddingRight: 24,
			},
		},
		pageTop: {
			height: '50px',
			paddingLeft: '30px !important',
			background: '#dddee0',
		},
	})
);

export default function EmailTemplateEditPage() {
	const theme = useTheme();
	const classes = useStyles({});
	const { templateId } = useParams();
	const templateService = new EmailTemplateService();

	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;

	const [loading, setLoading] = useState(templateId !== '0');
	const [templateData, setTemplateData] = useState<EmailTemplateInterface>();

	const loadTemplate = useCallback(async () => {
		const data = await templateService.single(templateId);
		setTemplateData(data);
		setLoading(false);
	}, []);

	useEffect(() => {
		if (templateId !== '0') {
			loadTemplate().then();
		}
	}, []);

	return (
		<BasePage>
			<Helmet>
				<title>{`${templateId !== '0' ? 'Edit' : 'Create'} email template`}</title>
				<meta name="description" content={`${templateId !== '0' ? 'Edit' : 'Create'} email template`} />
			</Helmet>

			<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="center" justifyContent="center">
				<Grid item xs={12} md={10} xl={10} className={classes.rightSide}>
					<Grid container spacing={3}>
						<Grid item sm={12} xs={12} style={{ position: 'relative' }}>
							<Grid container>
								<Grid item xs={6}>
									<BreadcrumbsComponent primary={`${templateId !== '0' ? 'Edit' : 'Create'} email template`} />
								</Grid>
							</Grid>
						</Grid>
						<Grid item lg={12} md={12} xs={12}>
							{loading && <LinearProgress />}

							{!loading && <FormEmailTemplateComponent initialValues={templateData} />}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</BasePage>
	);
}
