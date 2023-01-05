import React, { useContext } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Helmet } from 'react-helmet';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { EmailFiltersProvider } from '@context/email-filters.context';
import { AuthContext } from '@context/auth.context';
import { hasPerm } from '@helpers/checkPerms.helper';
import BasePage from '../base.page';
import EmailTemplatesListComponent from './email-templates-list.component';
import EmailSidebarFiltersComponent from './email-sidebar.component';
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
			width: 'calc(100% - 300px)',
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				marginLeft: 0,
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

export default function EmailTemplatesPage() {
	const theme = useTheme();
	const classes = useStyles({});
	const { isSuperAdmin, authBody } = useContext(AuthContext);

	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;

	return (
		<BasePage>
			<Helmet>
				<title>Email Templates</title>
				<meta name="description" content="Email Templates" />
			</Helmet>

			<EmailFiltersProvider>
				<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
					<Grid item xs={12} md={2} xl={2} className={classes.leftSide}>
						<EmailSidebarFiltersComponent />
					</Grid>
					<Grid item xs={12} md={9} xl={10} className={classes.rightSide}>
						<Grid container spacing={3}>
							<Grid item sm={12} xs={12} style={{ position: 'relative' }}>
								<Grid container>
									<Grid item xs={6}>
										<BreadcrumbsComponent primary="Email Templates" />
									</Grid>

									<Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
										<Button
											variant="contained"
											color="primary"
											startIcon={<AddIcon />}
											component={Link}
											to="/dashboard/email-templates/0"
										>
											Add Email Template
										</Button>
										{isSuperAdmin && hasPerm('Edit email template type', authBody) && (
											<Button
												variant="contained"
												color="primary"
												component={Link}
												to="/dashboard/email-template-type"
												startIcon={<LocalOfferIcon />}
												style={{ marginLeft: 15 }}
											>
												Edit Email Template Types
											</Button>
										)}
										{isSuperAdmin && (
											<Button
												variant="contained"
												color="primary"
												component={Link}
												to="/dashboard/log-email"
												startIcon={<VisibilityIcon />}
												style={{ marginLeft: 15 }}
											>
												View email logs
											</Button>
										)}
									</Grid>
								</Grid>
							</Grid>

							<Grid item lg={12} md={12} xs={12}>
								<EmailTemplatesListComponent />
								<br />
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</EmailFiltersProvider>
		</BasePage>
	);
}
