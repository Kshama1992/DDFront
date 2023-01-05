import React, { useContext, useState } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Helmet } from 'react-helmet';
import checkPermsHelper from '@helpers/checkPerms.helper';
import { AuthContext } from '@context/auth.context';
import { ActivityFiltersProvider } from '@context/activity-filters.context';
import BasePage from '../base.page';
import BreadcrumbsComponent from '../../components/breadcrumbs.component';
import ActivitySidebarFiltersComponent from './activity-sidebar.component';
import ActivityListComponent from './activity-list.component';
import ActivityAddComponent from './activity-add.component';
import { getFirstMenuItem } from '../../components/mainMenu/main-menu.component';

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
			paddingBottom: 15,
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
			position: 'relative',
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
		activityBtn: {
			display: 'flex',
			justifyContent: 'flex-end',
			float: 'right',
			[theme.breakpoints.down('md')]: {
				width: '100%',
				justifyContent: 'center',
			},
		},
	})
);

export default function ActivityPage() {
	const theme = useTheme();
	const classes = useStyles({});
	const navigate = useNavigate();
	const { authBody } = useContext(AuthContext);

	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;

	const [addVisible, setAddVisible] = useState(false);
	const [doReload, setDoReload] = useState(false);

	if (!checkPermsHelper([], ['Calender'], authBody)) navigate(getFirstMenuItem(authBody).url);

	const showAdd = () => {
		setAddVisible(true);
	};

	const hideAdd = () => {
		setDoReload(!doReload);
		setAddVisible(false);
	};

	return (
		<BasePage>
			<Helmet>
				<title>Activity</title>
				<meta name="description" content="Activity" />
			</Helmet>

			<ActivityFiltersProvider>
				<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
					<Grid item xs={12} md={2} xl={2} className={classes.leftSide}>
						<ActivitySidebarFiltersComponent />
					</Grid>

					<Grid item xs={12} md={9} xl={10} className={classes.rightSide}>
						<Grid container spacing={3}>
							<Grid item sm={12} xs={12} style={{ position: 'relative' }}>
								<Grid container>
									<Grid item xs={12} sm={6}>
										<BreadcrumbsComponent primary="Activity" />
									</Grid>

									<Grid item xs={12} sm={6}>
										<Button
											variant="contained"
											color="primary"
											className={classes.activityBtn}
											onClick={showAdd}
											startIcon={<AddIcon />}
										>
											Add Activity
										</Button>
									</Grid>
								</Grid>
							</Grid>
							<Grid item lg={12} md={12} xs={12}>
								<Paper style={{ position: 'relative' }}>
									<ActivityListComponent doReload={doReload} />
								</Paper>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</ActivityFiltersProvider>

			<ActivityAddComponent open={addVisible} onClose={hideAdd} />
		</BasePage>
	);
}
