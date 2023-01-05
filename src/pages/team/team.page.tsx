import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import TeamInterface from 'dd-common-blocks/dist/interface/team.interface';
import { TeamFiltersProvider } from '@context/team-filters.context';
import TeamService from '@service/team.service';
import { AuthContext } from '@context/auth.context';
import FormInviteToTeamUsersComponent from '@forms/form-invite-to-team-users.component';
import BasePage from '../base.page';
import BreadcrumbsComponent from '../../components/breadcrumbs.component';
import TeamMembersListComponent from './team-list.component';
import TeamSidebarFiltersComponent from './team-sidebar.component';
import TeamActivityComponent from './team-activity.component';

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
		},
		rightSide: {
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				marginLeft: 0,
				paddingRight: 24,
			},
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
		tableWrap: {},
		tableActivityWrap: {
			[theme.breakpoints.down('md')]: {
				marginTop: 40,
			},
		},
		inviteBtn: {
			marginTop: -7,
			marginBottom: -10,
			[theme.breakpoints.down('md')]: {
				width: '100%',
				margin: 0,
				marginTop: 10,
			},
		},
	})
);

export default function TeamPage() {
	const theme = useTheme();
	const teamService = new TeamService();

	const classes = useStyles({});
	const { teamId } = useParams();
	const navigate = useNavigate();
	const { isSuperAdmin, authBody, isBrandAdmin } = useContext(AuthContext);

	const [activeTab, setActiveTab] = useState<string>('members');
	const [inviteToTeamMembersVisible, setInviteToTeamMembersVisible] = useState<boolean>(false);

	const [team, setTeam] = useState<TeamInterface>();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
	const [activityDate, setAtivityDate] = useState<{ endDate?: Date; startDate?: Date }>({});

	const loadData = useCallback(async () => {
		if (!teamId) return;

		try {
			const loadedTeam = await teamService.single(teamId);
			setTeam(loadedTeam);
		} catch (e) {
			if (teamId) navigate(-1);
		}
	}, [teamId]);

	const handleDateChanged = (dateRange: { endDate?: Date; startDate?: Date }) => {
		setAtivityDate(dateRange);
	};
	const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
		setActiveTab(newValue);
	};

	useEffect(() => {
		if (teamId) loadData().then();
	}, [teamId]);

	const handleInviteSent = () => {
		setInviteToTeamMembersVisible(false);
		loadData().then();
	};

	return (
		<BasePage>
			<Helmet>
				<title>{team ? team.name : 'My team'}</title>
				<meta name="description" content={team ? team.name : 'My team'} />
			</Helmet>

			<TeamFiltersProvider>
				<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
					<Grid item xs={12} md={2} xl={2} className={classes.leftSide}>
						<TeamSidebarFiltersComponent onDateChanged={handleDateChanged} currentTab={activeTab} />
					</Grid>

					<Grid item xs={12} md={9} xl={10} className={classes.rightSide}>
						<Grid container spacing={3}>
							<Grid item sm={12} xs={12} style={{ position: 'relative' }}>
								<Grid container>
									<Grid item xs={12} md={6}>
										<BreadcrumbsComponent primary="My team - " secondary={team ? team.name : ''} />
									</Grid>
									<Grid item xs={12} md={6}>
										{(isBrandAdmin || isSuperAdmin || (authBody?.leadingTeams && authBody?.leadingTeams.length > 0)) && (
											<Button
												startIcon={<MailOutlineIcon />}
												variant="outlined"
												color="primary"
												className={classes.inviteBtn}
												onClick={() => setInviteToTeamMembersVisible(true)}
											>
												Invite to team
											</Button>
										)}
									</Grid>
								</Grid>
							</Grid>

							<Grid item lg={12} md={12} xs={12} className={activeTab === 'activity' ? classes.tableActivityWrap : classes.tableWrap}>
								<Paper style={{ position: 'relative' }}>
									{teamId && (
										<Tabs
											indicatorColor="primary"
											textColor="primary"
											value={activeTab}
											onChange={handleTabChange}
											style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}
										>
											<Tab label="Team members" value="members" />
											<Tab label="Team activity" value="activity" />
										</Tabs>
									)}

									{teamId && team && (
										<>
											{activeTab === 'members' && <TeamMembersListComponent team={team} />}
											{activeTab === 'activity' && <TeamActivityComponent team={team} activityDate={activityDate} />}
										</>
									)}
									{!teamId && (
										<Typography style={{ padding: 50, textAlign: 'center' }}>Please select team from left menu.</Typography>
									)}
								</Paper>
							</Grid>
						</Grid>
					</Grid>
				</Grid>

				<FormInviteToTeamUsersComponent
					open={inviteToTeamMembersVisible}
					onCancel={() => setInviteToTeamMembersVisible(false)}
					onDone={handleInviteSent}
				/>
			</TeamFiltersProvider>
		</BasePage>
	);
}
