import React, { useContext, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs, { extend } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import TeamInterface from 'dd-common-blocks/dist/interface/team.interface';
import TeamMemberStatus from 'dd-common-blocks/dist/type/TeamMemberStatus';
import TeamMemberInterface from 'dd-common-blocks/dist/interface/team-member.interface';
import { SnackBarContext } from '@context/snack-bar.context';
import { TeamFiltersContext } from '@context/team-filters.context';
import TeamService from '@service/team.service';
import { AuthContext } from '@context/auth.context';
import FormInviteToTeamUsersComponent from '@forms/form-invite-to-team-users.component';
import ConfirmDialog from '@shared-components/confirm.dialog';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import TableComponent from '@shared-components/table.component';
import { useDebounce } from '@helpers/debounce.helper';
import TeamListComponentStyles from './style/team-list.component';

extend(customParseFormat);

export default function TeamMembersListComponent({ team }: { team: TeamInterface }) {
	const classes = TeamListComponentStyles({});
	const teamService = new TeamService();

	const { isSuperAdmin, isTeamLead } = useContext(AuthContext);

	const { filters, setFilters } = useContext(TeamFiltersContext);
	const filtersDebounced = useDebounce(filters, 500);

	const { showSnackBar } = useContext(SnackBarContext);
	const [inviteToTeamMembersVisible, setInviteToTeamMembersVisible] = useState<boolean>(false);

	const [requestOngoing, setRequestOngoing] = useState<boolean>(false);
	const [confirmDeleteMemberDialogVisible, setConfirmDeleteMemberDialogVisible] = useState<boolean>(false);
	const [confirmAddMemberDialogVisible, setConfirmAddMemberDialogVisible] = useState<boolean>(false);
	const [deletingMember, setDeletingMember] = useState<TeamMemberInterface | undefined>(undefined);
	const [addingMember, setAddingMember] = useState<TeamMemberInterface | undefined>(undefined);

	const onMemberDeleteClick = (u: TeamMemberInterface) => {
		setDeletingMember(u);
		setConfirmDeleteMemberDialogVisible(true);
	};

	const onMemberReaddClick = (u: TeamMemberInterface) => {
		setAddingMember(u);
		setConfirmAddMemberDialogVisible(true);
	};

	const handleDeleteFromTeam = async (userId: number | undefined) => {
		if (!userId) return;
		try {
			await teamService.deleteMember(team.id, userId);
			showSnackBar('Member removed from team');
			setFilters({ type: 'searchString', payload: '' });
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		}
	};

	const handleDeleteInvite = async (membershipId: number | undefined) => {
		if (!membershipId) return;
		try {
			await teamService.deleteInvite(team.id, membershipId);
			showSnackBar('Invite deleted!');
			setFilters({ type: 'searchString', payload: '' });
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		}
	};

	const onMemberDeleteConfirm = async () => {
		if (!deletingMember) return;
		try {
			setRequestOngoing(true);
			if (deletingMember.member) await handleDeleteFromTeam(deletingMember.memberId);
			else await handleDeleteInvite(deletingMember.id);
			setConfirmDeleteMemberDialogVisible(false);
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setRequestOngoing(false);
		}
	};

	const onMemberReaddConfirm = async () => {
		if (!addingMember) return;
		try {
			setRequestOngoing(true);
			if (addingMember.member) {
				await teamService.addMember(addingMember.teamId, addingMember.memberId);
				showSnackBar('Member added to team');
				setFilters({ type: 'searchString', payload: '' });
			}
			setConfirmAddMemberDialogVisible(false);
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setRequestOngoing(false);
		}
	};

	const columns: GridColDef[] = [
		{
			field: 'name',
			headerName: 'Name',
			flex: 1.5,
			sortable: false,
			valueGetter: ({ row: tm }: GridRenderCellParams) => (tm.member ? `${tm.member.firstname} ${tm.member.lastname}` : ''),
		},
		{
			field: 'email',
			headerName: 'Email',
			flex: 1.5,
			sortable: false,
			valueGetter: ({ row: tm }: GridRenderCellParams) => tm.email || tm.member!.email,
		},
		{
			field: 'brand',
			headerName: 'Brand name',
			flex: 1,
			sortable: false,
			hide: !isSuperAdmin,
			valueGetter: ({ row: tm }: GridRenderCellParams) => tm.member!.brand && tm.member!.brand.name,
		},
		{
			field: 'memberType',
			headerName: 'Member type',
			flex: 1,
			sortable: false,
			valueGetter: ({ row: tm }: GridRenderCellParams) => (tm.memberId === team.teamLeadId ? 'Team lead' : 'Member'),
		},
		{
			field: 'status',
			headerName: 'Status',
			flex: 1,
			sortable: false,
			valueGetter: ({ row: tm }: GridRenderCellParams) => (!tm.isTeamLead ? tm.status : 'Team Lead'),
		},
		{
			field: 'date',
			headerName: 'Date',
			flex: 1,
			sortable: false,
			valueGetter: ({ row: tm }: GridRenderCellParams) => dayjs(tm.createdAt).format('MMMM D, YYYY'),
		},
		{
			field: 'actions',
			sortable: false,
			width: 120,
			headerName: '',
			valueGetter: ({ row: tm }: GridRenderCellParams) => {
				return (
					<>
						{isTeamLead && tm.status === TeamMemberStatus.MEMBER_REMOVED && (
							<IconButton size="small" aria-label="delete" onClick={() => onMemberReaddClick(tm)}>
								<AddIcon color="primary" />
							</IconButton>
						)}
						{isTeamLead && tm.memberId !== team.teamLeadId && tm.status !== TeamMemberStatus.MEMBER_REMOVED && (
							<IconButton size="small" aria-label="delete" onClick={() => onMemberDeleteClick(tm)}>
								<DeleteIcon color="secondary" />
							</IconButton>
						)}
					</>
				);
			},
		},
	];

	const doSearch = async (inputFilters: any) => teamService.listMembers(team.id, inputFilters);

	return (
		<div className={classes.root}>
			<TableComponent doSearch={doSearch} filters={filtersDebounced} columns={columns} disableColumnMenu disableColumnFilter />

			<ConfirmDialog
				isLoading={requestOngoing}
				actionText="Remove"
				text={`Are you sure you want to remove ${deletingMember?.email}?`}
				open={!!deletingMember && confirmDeleteMemberDialogVisible}
				onClose={() => setConfirmDeleteMemberDialogVisible(false)}
				action={onMemberDeleteConfirm}
			/>

			<ConfirmDialog
				isLoading={requestOngoing}
				actionText="Re-add"
				text={`Are you sure you want to add ${addingMember?.email}?`}
				open={!!addingMember && confirmAddMemberDialogVisible}
				onClose={() => setConfirmAddMemberDialogVisible(false)}
				action={onMemberReaddConfirm}
			/>

			<FormInviteToTeamUsersComponent
				open={inviteToTeamMembersVisible}
				onCancel={() => setInviteToTeamMembersVisible(false)}
				onDone={() => setInviteToTeamMembersVisible(false)}
			/>
		</div>
	);
}
