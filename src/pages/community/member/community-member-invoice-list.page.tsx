import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTheme, Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogContent from '@mui/material/DialogContent';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import Dialog from '@mui/material/Dialog';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import UserService from '@service/user.service';
import BreadcrumbsComponent from '../../../components/breadcrumbs.component';
import BasePage from '../../base.page';
import { CommunitySidebarSingleItemComponent } from '../community-sidebar.component';
import InvoiceListComponent from '../../history/invoice-list.component';
import InvoiceViewComponent from '../../history/invoice-view.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		rootMobile: {
			width: '100%',
			height: '100%',
			margin: 0,
			'& .react-tel-input .form-control': {
				borderRadius: 3,
				// padding: '17px 14px 17px 58px'
			},
			'& .react-tel-input .flag-dropdown:before': {
				display: 'none !important',
			},
		},
		root: {
			width: 'calc(100% - 90px)',
			height: '100%',
			margin: 0,
			marginLeft: 90,
			'& .react-tel-input .form-control': {
				borderRadius: 3,
				// padding: '17px 14px 17px 58px'
			},
			'& .react-tel-input .flag-dropdown:before': {
				display: 'none !important',
			},
		},
		leftSide: {
			maxWidth: 300,
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				width: '100%',
				paddingRight: 24,
			},
		},
		rightSide: {
			width: 'calc(100% - 300px)',
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				width: '100%',
				paddingRight: 24,
			},
		},
		inner: {
			position: 'relative',
		},
		backBtn: {
			textTransform: 'none',
			marginTop: 15,
			'& .MuiSvgIcon-root': {
				color: theme.palette.primary.main,
			},
		},
	})
);

export default function CommunityMemberInvoiceListPage() {
	const theme = useTheme();
	const classes = useStyles({});

	const userService = new UserService();

	const { id, type } = useParams();
	const navigate = useNavigate();

	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;

	const [userProfile, setUserProfile] = useState<UserInterface>();

	const loadUserData = useCallback(async () => {
		try {
			const d = await userService.single(id);
			setUserProfile(d);
		} catch (e) {
			console.error(e);
		}
	}, [id]);

	useEffect(() => {
		loadUserData().then();
	}, [id]);

	const [newInvoiceVisible, setNewInvoiceVisible] = useState(false);

	const handleChangeTab = (event: React.SyntheticEvent, value: any) => {
		navigate(`/dashboard/community/members/${id}/invoices/${value}`);
	};

	const handleGoToProfile = () => {
		navigate(`/dashboard/community/members/${id}`);
	};

	const handleNewInvClose = () => {
		setNewInvoiceVisible(false);
	};

	const handleInvoiceSave = async () => {
		await loadUserData();
		handleNewInvClose();
	};

	return (
		<BasePage>
			<Helmet>
				<title>
					Community: {`${userProfile ? `${userProfile.firstname} ${userProfile.lastname} - Invoice History` : 'Invoice History'}`}
				</title>
				<meta
					name="description"
					content={`Community: Members - ${
						userProfile ? `${userProfile.firstname} ${userProfile.lastname} - Invoice History` : 'Invoice History'
					}`}
				/>
			</Helmet>

			<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
				<Grid item xs={12} sm={3} className={classes.leftSide}>
					<CommunitySidebarSingleItemComponent activeType="members" />
				</Grid>

				<Grid item xs={12} sm={9} className={classes.rightSide}>
					<Grid container spacing={3}>
						<Grid item sm={6} xs={6}>
							<BreadcrumbsComponent
								primary="Community:"
								secondary={`Members - ${userProfile ? `${userProfile.firstname} ${userProfile.lastname}` : 'Member'}`}
							/>
							<Button onClick={handleGoToProfile} className={classes.backBtn} startIcon={<ChevronLeftIcon />}>
								Back to {userProfile ? `${userProfile.firstname} ${userProfile.lastname} - Invoice History` : 'Invoice History'}
							</Button>
						</Grid>

						<Grid item sm={3} xs={3} />

						<Grid item sm={3} xs={3}>
							<Button onClick={() => setNewInvoiceVisible(true)} startIcon={<AddCircleIcon />} variant="outlined" color="primary">
								Create new
							</Button>
						</Grid>
					</Grid>
					<Grid container spacing={3}>
						<Grid item md={12} xl={10} xs={12}>
							{userProfile && (
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

									{type === 'upcoming' && <InvoiceListComponent user={userProfile} type="upcoming" />}
									{type === 'past' && <InvoiceListComponent user={userProfile} type="past" />}
								</Paper>
							)}
							<br />
						</Grid>
					</Grid>
				</Grid>
			</Grid>

			<Dialog onClose={handleNewInvClose} open={newInvoiceVisible} maxWidth="md">
				<DialogContent>
					{userProfile && <InvoiceViewComponent user={userProfile} onClose={handleNewInvClose} doBgRefresh={handleInvoiceSave} />}
				</DialogContent>
			</Dialog>
		</BasePage>
	);
}
