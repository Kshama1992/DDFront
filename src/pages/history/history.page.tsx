import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import createStyles from '@mui/styles/createStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import makeStyles from '@mui/styles/makeStyles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { siteTitleHelper } from '@helpers/site-title.helper';
import { siteDescriptionHelper } from '@helpers/site-description.helper';
import { AuthContext } from '@context/auth.context';
import { Theme } from '@mui/material/styles';
import checkPermsHelper from '@helpers/checkPerms.helper';
import BreadcrumbsComponent from '../../components/breadcrumbs.component';
import BasePage from '../base.page';
import InvoiceListComponent from './invoice-list.component';
import { getFirstMenuItem } from '../../components/mainMenu/main-menu.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		rootMobile: {
			width: '100%',
			height: 'calc(100% - 70px)',
			margin: 0,
			background: '#efefef',
			'& .react-tel-input .form-control': {
				borderRadius: 3,
			},
			'& .react-tel-input .flag-dropdown:before': {
				display: 'none !important',
			},
		},
		root: {
			width: 'calc(100% - 90px)',
			height: 'calc(100% - 70px)',
			margin: 0,
			marginLeft: 90,
			background: '#efefef',
			'& .react-tel-input .form-control': {
				borderRadius: 3,
			},
			'& .react-tel-input .flag-dropdown:before': {
				display: 'none !important',
			},
		},

		top: {
			paddingTop: 10,
			height: '50px',
			paddingLeft: '30px !important',
			background: '#dddee0',
		},
		inner: {
			position: 'relative',
			// minHeight: 300,
			'& .MuiTab-root': {
				width: 160,
			},
		},
		gridWrap: {
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				marginLeft: 0,
				paddingRight: 24,
			},
		},
	})
);

export default function HistoryPage() {
	const classes = useStyles({});
	const { authBody } = useContext(AuthContext);
	// @ts-ignore TODO
	const isMobile = useMediaQuery((t) => t.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;
	const { type } = useParams();
	const navigate = useNavigate();

	if (!checkPermsHelper(['Customer Activity'], [], authBody)) navigate(getFirstMenuItem(authBody).url);

	const handleChangeTab = (event: React.SyntheticEvent, value: any) => {
		navigate(`/history/${value}`);
	};

	return (
		<BasePage>
			<Helmet>
				<title>{siteTitleHelper('Invoices History')}</title>
				<meta name="description" content={siteDescriptionHelper()} />
			</Helmet>

			<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
				<Grid item xs={12} className={classes.top}>
					<BreadcrumbsComponent primary="Account:" secondary="History" />
				</Grid>
				<Grid item md={10} xl={10} xs={12} className={classes.gridWrap}>
					<Paper className={classes.inner}>
						<Paper>
							<Tabs
								value={type}
								indicatorColor="primary"
								textColor="primary"
								onChange={handleChangeTab}
								aria-label="disabled tabs example"
							>
								<Tab label="Past" value="past" />
								<Tab label="Upcoming" value="upcoming" />
							</Tabs>
						</Paper>

						<Divider />

						{authBody && type === 'upcoming' && <InvoiceListComponent user={authBody} type="upcoming" />}
						{authBody && type === 'past' && <InvoiceListComponent user={authBody} type="past" />}
					</Paper>
					<br />
				</Grid>
			</Grid>
		</BasePage>
	);
}
