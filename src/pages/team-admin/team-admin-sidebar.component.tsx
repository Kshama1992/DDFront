import React, { useContext, useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import { AuthContext } from '@context/auth.context';
import AutocompleteAsync from '@forms/elements/autocomplete-async.component';
import TeamAdminSidebarComponentStyles from './style/team-admin-sidebar.component';
import { TeamAdminFiltersContext } from './team-admin-filters.context';

export default function TeamAdminSidebarFiltersComponent() {
	const classes = TeamAdminSidebarComponentStyles();
	const theme = useTheme();
	const isPhone = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

	const { isSuperAdmin } = useContext(AuthContext);

	const { teamAdminFilters, setTeamAdminFilters } = useContext(TeamAdminFiltersContext);
	const [expanded, setExpanded] = useState<boolean>(!isPhone);

	const handleExpand = () => {
		setExpanded(isPhone ? !expanded : true);
	};

	const setSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTeamAdminFilters({ type: 'searchString', payload: e.target.value });
	};

	const setBrandId = (id: number | null) => {
		setTeamAdminFilters({ type: 'brandId', payload: id || null });
	};

	return (
		<Paper>
			<Accordion expanded={expanded} onChange={handleExpand}>
				<AccordionSummary expandIcon={isPhone ? <ExpandMoreIcon /> : ''}>
					<Typography>FILTER BY</Typography>
				</AccordionSummary>
				<AccordionDetails className={classes.accDetails}>
					<Grid container spacing={0} style={{ paddingBottom: 15 }}>
						<Grid item xs={12} className={classes.filterItem}>
							<TextField
								label="Search by name"
								value={teamAdminFilters.searchString || ''}
								className={classes.searchField}
								onChange={setSearch}
								fullWidth
								variant="standard"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon />
										</InputAdornment>
									),
								}}
							/>
						</Grid>

						{isSuperAdmin && (
							<Grid item xs={12} className={classes.filterItem}>
								<AutocompleteAsync
									type="brand"
									label="Brand"
									variant="standard"
									showAll
									filter={{}}
									shrink={false}
									defaultValue={Number(teamAdminFilters.brandId)}
									onChange={setBrandId}
								/>
							</Grid>
						)}
					</Grid>
				</AccordionDetails>
			</Accordion>
		</Paper>
	);
}
