import React, { useContext } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import TeamMemberStatus from 'dd-common-blocks/dist/type/TeamMemberStatus';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { useDebounce } from '@helpers/debounce.helper';
import TeamService from '@service/team.service';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import TableComponent from '@shared-components/table.component';
import TeamMemberInterface from 'dd-common-blocks/dist/interface/team-member.interface';
import { TeamAdminFiltersContext } from './team-admin-filters.context';

export default function TeamListComponent() {
	const teamService = new TeamService();
	const { teamAdminFilters } = useContext(TeamAdminFiltersContext);
	const filtersDebounced = useDebounce(teamAdminFilters, 500);

	const columns: GridColDef[] = [
		{
			field: 'name',
			headerName: 'Name',
			flex: 1,
			sortable: false,
		},
		{
			field: 'brand.name',
			headerName: 'Brand name',
			flex: 1,
			sortable: false,
			valueGetter: (cellParams: GridRenderCellParams) => {
				const { row } = cellParams;
				return (
					<Typography
						component={Link}
						to={`/dashboard/brand/${row.brandId}`}
						style={{ fontSize: 15, paddingTop: 5, textDecoration: 'none' }}
					>
						{row.brand ? row.brand.name : ''}
					</Typography>
				);
			},
		},
		{
			field: 'teamLead.name',
			headerName: 'Team lead',
			flex: 1,
			sortable: false,
			valueGetter: (cellParams: GridRenderCellParams) => {
				const { row } = cellParams;
				return (
					<Typography
						component={Link}
						to={`/dashboard/community/members/${row.teamLeadId}`}
						style={{ fontSize: 15, paddingTop: 5, textDecoration: 'none' }}
					>
						{row.teamLead!.firstname} {row.teamLead!.lastname}
					</Typography>
				);
			},
		},
		{
			field: 'usersCount',
			headerName: 'Users count',
			width: 120,
			sortable: false,
			valueGetter: (cellParams: GridRenderCellParams) => {
				const { row } = cellParams;
				return row.members?.filter((m: TeamMemberInterface) => m.status !== TeamMemberStatus.MEMBER_REMOVED).length || 0;
			},
		},
		{
			field: 'actions',
			sortable: false,
			width: 120,
			headerName: '',
			valueGetter: (cellParams: GridRenderCellParams) => {
				const { row } = cellParams;
				return (
					<IconButton
						aria-label="expand row"
						size="small"
						color="primary"
						component={Link}
						to={`/dashboard/team-admin/${row.id}`}
						style={{ marginRight: 15 }}
					>
						<EditIcon />
					</IconButton>
				);
			},
		},
	];

	const doSearch = async (filters: any) => teamService.list(filters);

	return (
		<>
			<Paper>
				<TableComponent
					doSearch={doSearch}
					filters={filtersDebounced}
					columns={columns}
					disableColumnMenu
					disableColumnFilter
					title="Teams"
				/>
			</Paper>

			<br />
		</>
	);
}
