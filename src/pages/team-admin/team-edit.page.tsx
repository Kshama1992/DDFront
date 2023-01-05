import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Helmet } from 'react-helmet';
import TeamInterface from 'dd-common-blocks/dist/interface/team.interface';
import TeamService from '@service/team.service';
import FormTeamComponent from '@forms/form-team.component';
import TeamFormValuesInterface from '@forms/interface/team-form-values.interface';
import BasePage from '../base.page';
import BreadcrumbsComponent from '../../components/breadcrumbs.component';
import TeamEditPageStyles from './style/team-edit.page';

export default function TeamEditPage() {
	const theme = useTheme();
	const classes = TeamEditPageStyles({});

	const teamService = new TeamService();

	const { teamId } = useParams();

	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;

	const [loading, setLoading] = useState(teamId !== '0');
	const [teamData, setTeamData] = useState<TeamInterface>();

	const loadTeam = useCallback(async () => {
		const data = await teamService.single(teamId);
		setTeamData(data);
		setLoading(false);
	}, []);

	useEffect(() => {
		if (teamId !== '0') {
			loadTeam().then();
		}
	}, []);

	return (
		<BasePage>
			<Helmet>
				<title>{`Team ${loading || !teamData ? ' create' : ` edit - ${teamData.name}`}`}</title>
				<meta name="description" content="Team" />
			</Helmet>

			<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
				<Grid item xs={12} md={9} xl={10} className={classes.rightSide}>
					<Grid container spacing={3}>
						<Grid item sm={12} xs={12} style={{ position: 'relative' }}>
							<BreadcrumbsComponent
								primary={`${teamId !== '0' ? 'Edit' : 'Add'} a team:`}
								secondary={teamId !== '0' && teamData ? teamData.name : ''}
							/>
						</Grid>
						<Grid item lg={10} md={12} xs={12}>
							{loading && <LinearProgress />}
							{!loading && (
								<FormTeamComponent initialValues={teamData as TeamFormValuesInterface} needUpdate={() => loadTeam().then()} />
							)}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</BasePage>
	);
}
