import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { Theme, useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CachedIcon from '@mui/icons-material/Cached';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Helmet } from 'react-helmet';
import VenueInterface from 'dd-common-blocks/dist/interface/venue.interface';
import VenueStatus from 'dd-common-blocks/dist/type/VenueStatus';
import VenueService from '@service/venue.service';
import { AuthContext } from '@context/auth.context';
import checkPermsHelper from '@helpers/checkPerms.helper';
import VenueFormValuesInterface from '@forms/interface/venue-form-values.interface';
import FormVenueComponent from '@forms/form-venue.component';
import { SnackBarContext } from '@context/snack-bar.context';
import BasePage from '../base.page';
import BreadcrumbsComponent from '../../components/breadcrumbs.component';
import VenueSidebarComponent from './venue-sidebar.component';
import { getFirstMenuItem } from '../../components/mainMenu/main-menu.component';
import VenueInventoryComponent from './venue-inventory.component';

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
			height: 'calc(100vh - 75px)',
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				width: '100%',
				position: 'relative',
				paddingRight: 24,
				height: 'auto',
			},
		},
		rightSide: {
			marginLeft: 350,
			width: 'calc(100% - 350px)',
			position: 'relative',
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				marginLeft: 0,
				paddingRight: 24,
			},
		},
		formWrapper: {
			padding: 25,
		},
		topTitle: {
			position: 'relative',
			'& .MuiTab-root': {
				padding: '30px',
			},
			'& h1': {
				position: 'absolute',
				top: 25,
				left: 15,
			},
		},
		addBtn: {
			position: 'absolute',
			top: 15,
			right: 15,
			padding: '6px 16px',
			[theme.breakpoints.down('md')]: {
				position: 'relative',
				top: 0,
				left: 0,
				margin: '15px auto 0 auto',
				display: 'flex',
				maxWidth: 200,
			},
		},
		tabsWrap: {
			justifyContent: 'flex-end',
		},
		topTab: {
			[theme.breakpoints.down('md')]: {
				width: '100%',
				maxWidth: '100%',
				borderBottom: '1px solid #d5d5d5',
			},
		},
	})
);

interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div role="tabpanel" hidden={value !== index} id={`wrapped-tabpanel-${index}`} aria-labelledby={`wrapped-tab-${index}`} {...other}>
			{value === index && <Box>{children}</Box>}
		</div>
	);
}

export default function VenueEditPage() {
	const theme = useTheme();
	const classes = useStyles({});

	const { venueId } = useParams();
	const navigate = useNavigate();
	const { hash, pathname } = useLocation();

	const venueService = new VenueService();

	const { authBody, isSuperAdmin } = useContext(AuthContext);
	const { showSnackBar } = useContext(SnackBarContext);

	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;

	const [activeTab, setActiveTab] = useState<string>(hash.substr(1) || 'info');

	const [reloadSidebar, setReloadSidebar] = useState(true);
	const [loading, setLoading] = useState(true);
	const [loadingUpdate, setLoadingUpdate] = useState(false);
	const [venueData, setVenueData] = useState<VenueInterface>();

	if (!checkPermsHelper([], ['Venues'], authBody)) navigate(getFirstMenuItem(authBody).url);

	const loadVenue = useCallback(async () => {
		setLoading(true);

		const data = await venueService.single(venueId);
		setVenueData(data);
		setLoading(false);
	}, [venueId]);

	const updateProviderData = async () => {
		try {
			setLoadingUpdate(true);
			await venueService.providerDataUpdate(+venueId);
			showSnackBar('Done');
		} catch (e) {
			showSnackBar(e.message || 'Error');
		} finally {
			setLoadingUpdate(false);
		}
	};

	const batchUpdateProviderData = async () => {
		try {
			setLoadingUpdate(true);
			await venueService.providerBatchDataUpdate();
			showSnackBar('Done');
		} catch (e) {
			showSnackBar(e.message || 'Error');
		} finally {
			setLoadingUpdate(false);
		}
	};

	useEffect(() => {
		setLoading(true);

		if (venueId !== '0') {
			loadVenue().then();
		} else {
			setVenueData(undefined);
			setLoading(false);
			setActiveTab('info');
		}
	}, [venueId]);

	const changeTab = (event: React.SyntheticEvent, newValue: string) => {
		setActiveTab(newValue);
		navigate(`${pathname}#${newValue}`);
	};

	const updateSidebar = () => {
		setReloadSidebar(!reloadSidebar);
		setLoading(true);

		if (venueId !== '0') {
			loadVenue().then();
		} else {
			setVenueData(undefined);
			setLoading(false);
			setActiveTab('info');
		}
	};

	const handleDelete = () => {
		updateSidebar();
		navigate('/dashboard/venue/0');
	};

	return (
		<BasePage>
			<Helmet>
				<title>{`Venue ${loading || !venueData ? ' ' : ` - ${venueData.name}`}`}</title>
				<meta name="description" content="Venue" />
			</Helmet>

			<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
				<Grid item xs={12} md={3} xl={3} className={classes.leftSide}>
					<VenueSidebarComponent reload={reloadSidebar} />
				</Grid>

				<Grid item xs={12} md={9} xl={9} className={classes.rightSide}>
					<Grid container spacing={3}>
						<Grid item lg={10} md={12} xs={12} style={{ position: 'relative' }}>
							<BreadcrumbsComponent primary="Spaces:" secondary={`Venues ${loading || !venueData ? ' New' : ` - ${venueData.name}`}`} />
							{isSuperAdmin && (
								<Button
									variant="outlined"
									className={classes.addBtn}
									component={Link}
									to="/dashboard/venue-type"
									color="primary"
									style={{ right: -140 }}
								>
									Venue Types
								</Button>
							)}
							{venueId !== '0' && checkPermsHelper([], ['Spaces'], authBody) && (
								<Button
									className={classes.addBtn}
									component={Link}
									to={`/dashboard/venue/${venueId}/space/0`}
									variant="outlined"
									startIcon={<AddIcon />}
									disabled={venueData && venueData.status === VenueStatus.DELETED}
									color="primary"
								>
									Add a package
								</Button>
							)}
							{venueId !== '0' && checkPermsHelper([], ['Super admin hidden options'], authBody, true) && (
								<Button
									className={classes.addBtn}
									style={{ right: 210, top: 0 }}
									onClick={updateProviderData}
									variant="outlined"
									startIcon={<CachedIcon />}
									disabled={(venueData && venueData.status === VenueStatus.DELETED) || loadingUpdate}
									color="primary"
								>
									Update venue payment data
								</Button>
							)}
							{checkPermsHelper([], ['Super admin hidden options'], authBody, true) && (
								<Button
									className={classes.addBtn}
									style={{ right: 210, top: 35 }}
									onClick={batchUpdateProviderData}
									variant="outlined"
									startIcon={<CachedIcon />}
									disabled={(venueData && venueData.status === VenueStatus.DELETED) || loadingUpdate}
									color="primary"
								>
									Update stripe all
								</Button>
							)}
						</Grid>
						<Grid item lg={12} md={12} xs={12}>
							{loadingUpdate && <LinearProgress />}
							{loading && <LinearProgress />}
							{!loading && (
								<>
									<Paper className={classes.topTitle}>
										{!isMobile && (
											<Typography component="h1" variant="subtitle1">
												{loading || !venueData ? 'New' : venueData.name}
											</Typography>
										)}
										<Tabs
											classes={{ flexContainer: classes.tabsWrap }}
											value={activeTab}
											indicatorColor="primary"
											orientation={isMobile ? 'vertical' : 'horizontal'}
											textColor="primary"
											onChange={changeTab}
										>
											<Tab label="Venue information" value="info" className={classes.topTab} />
											{checkPermsHelper([], ['Spaces'], authBody) && (
												<Tab
													label="Venue Inventory"
													disabled={venueId === '0'}
													value="inventory"
													className={classes.topTab}
												/>
											)}
										</Tabs>
									</Paper>

									<TabPanel value={activeTab} index="info">
										{venueId !== '0' && (
											<FormVenueComponent
												initialValues={venueData as VenueFormValuesInterface}
												onSave={updateSidebar}
												onDelete={handleDelete}
											/>
										)}
										{venueId === '0' && <FormVenueComponent initialValues={undefined} onSave={updateSidebar} />}
									</TabPanel>

									<TabPanel value={activeTab} index="inventory">
										<VenueInventoryComponent venueData={venueData} />
									</TabPanel>
								</>
							)}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</BasePage>
	);
}
