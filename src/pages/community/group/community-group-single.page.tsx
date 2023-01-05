import React, { useContext, useCallback, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTheme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import GroupInterface from 'dd-common-blocks/dist/interface/group.interface';
import LinearProgress from '@mui/material/LinearProgress';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import useMediaQuery from '@mui/material/useMediaQuery';
import checkPermsHelper from '@helpers/checkPerms.helper';
import { AuthContext } from '@context/auth.context';
import GroupService from '@service/group.service';
import { Theme } from '@mui/material/styles';
import { SnackBarContext } from '@context/snack-bar.context';
import { CommunityFiltersProvider } from '@context/community-filters.context';
import BreadcrumbsComponent from '../../../components/breadcrumbs.component';
import BasePage from '../../base.page';
import { CommunitySidebarComponent } from '../community-sidebar.component';
import CommunityGroupInfoComponent from './community-group-info.component';
import CommunityGroupFeedComponent from './community-group-feed.component';
import GroupCompanyCreateComponent from '../group-company-create.component';
import { defaultCommunityRedirect } from '../../../components/mainMenu/main-menu.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		rootMobile: {
			width: '100%',
			height: '100%',
			margin: 0,
		},
		root: {
			width: 'calc(100% - 90px)',
			height: '100%',
			margin: 0,
			marginLeft: 90,
		},
		profileTop: {
			height: '50px',
			paddingLeft: '30px !important',
			background: '#dddee0',
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
		topTitle: {
			padding: 25,
			boxShadow: '0px 2px 2px 0px grey',
		},
		backContainer: {
			padding: 20,
			backgroundColor: '#dadada',
			boxSizing: 'border-box',
		},
		backIcon: {
			marginBottom: -7,
		},
		backLink: {
			textDecoration: 'none',
		},
		addBtn: {
			position: 'absolute',
			top: 15,
			right: 10,
		},
	})
);

export default function CommunityGroupSinglePage() {
	const theme = useTheme();
	const classes = useStyles({});
	const groupService = new GroupService();
	const { id } = useParams();
	const navigate = useNavigate();
	const { authBody } = useContext(AuthContext);
	const { showSnackBar } = useContext(SnackBarContext);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [group, setGroup] = useState<GroupInterface>();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;

	// const loadData ?
	if (!checkPermsHelper(['Enable Group Tab'], ['Community Groups'], authBody)) navigate(defaultCommunityRedirect(authBody));

	const loadSingle = useCallback(async () => {
		try {
			const loadedGroup = await groupService.single(id);
			setGroup(loadedGroup);
		} catch (e) {
			console.error(e);
			showSnackBar((e as Error).message);
			navigate(-1);
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	useEffect(() => {
		loadSingle().then();
	}, [id]);

	const handleSave = () => loadSingle();
	return (
		<BasePage>
			<Helmet>
				<title>Community: {`Groups - ${group ? group.name : 'Group'}`}</title>
				<meta name="description" content={`Community: Groups - ${group ? group.name : 'Group'}`} />
			</Helmet>

			<CommunityFiltersProvider>
				<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
					<Grid item xs={12} md={2} xl={2} className={classes.leftSide}>
						<CommunitySidebarComponent activeType="groups" />
					</Grid>

					<Grid item xs={12} md={9} xl={10} className={classes.rightSide}>
						<Grid container spacing={3}>
							<Grid item sm={12} xs={12} style={{ position: 'relative' }}>
								<BreadcrumbsComponent primary="Community:" secondary={`Groups - ${group ? group.name : 'Group'}`} />
								<GroupCompanyCreateComponent type="group" />
							</Grid>
							<Grid item sm={6} xs={12}>
								<Paper>
									<Grid container spacing={0}>
										<Grid item xs={12} className={classes.topTitle}>
											<Typography component="h2" variant="body2">
												{group ? group.name : 'Group'}
											</Typography>
										</Grid>
										<Grid item xs={12} className={classes.backContainer}>
											<Typography className={classes.backLink} component={Link} to="/community/groups">
												<ChevronLeftIcon className={classes.backIcon} /> Back to groups list
											</Typography>
										</Grid>
									</Grid>

									{isLoading && <LinearProgress />}
									{group && <CommunityGroupInfoComponent data={group} onSaved={handleSave} />}
								</Paper>
							</Grid>

							<Grid item sm={6} xs={12}>
								<CommunityGroupFeedComponent />
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</CommunityFiltersProvider>
		</BasePage>
	);
}
