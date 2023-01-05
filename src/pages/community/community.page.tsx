import React, { useContext, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Theme, useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Helmet } from 'react-helmet';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { AuthContext } from '@context/auth.context';
import FormImportUsersComponent from '@forms/form-import-users.component';
import FormInviteUsersComponent from '@forms/form-invite-users.component';
import checkPermsHelper from '@helpers/checkPerms.helper';
import GetAppIcon from '@mui/icons-material/GetApp';
import { CommunityFiltersProvider } from '@context/community-filters.context';
import BasePage from '../base.page';
import { CommunitySidebarComponent } from './community-sidebar.component';
import BreadcrumbsComponent from '../../components/breadcrumbs.component';
import CommunityCompanyListComponent from './company/community-company-list.component';
import CommunityMembersListComponent from './member/community-member-list.component';
import CommunityGroupListComponent from './group/community-group-list.component';
import CommunityFeedListComponent from './feed/community-feed-list.component';
import GroupCompanyCreateComponent from './group-company-create.component';
import FeedCategoryComponent from './feed/feed-category.component';
import { defaultCommunityRedirect } from '../../components/mainMenu/main-menu.component';

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
		pageTop: {
			height: '50px',
			paddingLeft: '30px !important',
			background: '#dddee0',
		},
		btnsRow: {
			marginTop: -60,
			position: 'relative',
			[theme.breakpoints.down('md')]: {
				margin: 0,
				paddingTop: 10,
				paddingBottom: 30,
				'& button, & a': {
					width: '100%',
					float: 'none !important',
					margin: '0 0 10px 0 !important',
				},
			},
			'& button, & a': {
				float: 'right',
				marginLeft: 15,
			},
		},
	})
);

export default function CommunityPage() {
	const theme = useTheme();
	const classes = useStyles({});
	const { type } = useParams();
	const navigate = useNavigate();
	const { isSuperAdmin, isBrandAdmin, authBody } = useContext(AuthContext);

	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;

	const [importMembersVisible, setImportMembersVisible] = useState<boolean>(false);
	const [inviteMembersVisible, setInviteMembersVisible] = useState<boolean>(false);

	if (!checkPermsHelper(['Customer Community'], ['Community Members', 'Community Companies', 'Community Groups', 'Feeds'], authBody))
		navigate(defaultCommunityRedirect(authBody));

	return (
		<BasePage>
			<Helmet>
				<title>Community: {type ? type.charAt(0).toUpperCase() + type.slice(1) : ''}</title>
				<meta name="description" content={`Community: ${type ? type.charAt(0).toUpperCase() + type.slice(1) : ''}`} />
			</Helmet>

			<CommunityFiltersProvider>
				<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
					<Grid item xs={12} md={2} xl={2} className={classes.leftSide}>
						<CommunitySidebarComponent />
					</Grid>

					<Grid item xs={12} md={9} xl={10} className={classes.rightSide}>
						<Grid container spacing={3}>
							<Grid item sm={12} xs={12} style={{ marginTop: 15 }}>
								<BreadcrumbsComponent primary="Community:" secondary={type ? type.charAt(0).toUpperCase() + type.slice(1) : ''} />
							</Grid>

							<Grid item sm={12} xs={12} className={classes.btnsRow}>
								{type && (
									<>
										{(isBrandAdmin || isSuperAdmin) && type === 'members' && (
											<Button
												// className={classes.addBtn}
												component={Link}
												to="/dashboard/community/members/0"
												startIcon={<PersonAddIcon />}
												variant="outlined"
												color="primary"
											>
												Add Member
											</Button>
										)}
										{(isBrandAdmin || isSuperAdmin) && type === 'members' && (
											<Button
												// className={classes.addBtn2}
												startIcon={<GetAppIcon />}
												variant="outlined"
												color="primary"
												onClick={() => setImportMembersVisible(true)}
											>
												Import Members
											</Button>
										)}
										{(isBrandAdmin || isSuperAdmin) && type === 'members' && (
											<Button
												// className={classes.addBtn3}
												startIcon={<MailOutlineIcon />}
												variant="outlined"
												color="primary"
												onClick={() => setInviteMembersVisible(true)}
											>
												Invite members
											</Button>
										)}
										{(isBrandAdmin || isSuperAdmin) && type === 'feeds' && <FeedCategoryComponent />}
										{type === 'groups' && <GroupCompanyCreateComponent type="group" />}
										{type === 'companies' && <GroupCompanyCreateComponent type="company" />}
									</>
								)}
							</Grid>

							<Grid item lg={type && type === 'feeds' ? 10 : 12} md={12} xs={12}>
								{type && type === 'feeds' && <CommunityFeedListComponent />}
								{type && type === 'groups' && <CommunityGroupListComponent />}
								{type && type === 'companies' && <CommunityCompanyListComponent />}
								{type && type === 'members' && <CommunityMembersListComponent />}
							</Grid>
						</Grid>
					</Grid>
				</Grid>

				<FormImportUsersComponent
					open={importMembersVisible}
					onCancel={() => setImportMembersVisible(false)}
					onImportDone={() => setImportMembersVisible(false)}
				/>

				<FormInviteUsersComponent
					open={inviteMembersVisible}
					onCancel={() => setInviteMembersVisible(false)}
					onDone={() => setInviteMembersVisible(false)}
				/>
			</CommunityFiltersProvider>
		</BasePage>
	);
}
