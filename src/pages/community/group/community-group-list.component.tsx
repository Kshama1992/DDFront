import React, { useContext, useState } from 'react';
import { Theme, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import createStyles from '@mui/styles/createStyles';
import Typography from '@mui/material/Typography';
import GroupIcon from '@mui/icons-material/Group';
import RoomIcon from '@mui/icons-material/Room';
import pluralize from 'pluralize';
import makeStyles from '@mui/styles/makeStyles';
import { Link, useNavigate } from 'react-router-dom';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import GroupInterface from 'dd-common-blocks/dist/interface/group.interface';
import GroupMemberInterface from 'dd-common-blocks/dist/interface/group-member.interface';
import { CommunityFiltersContext } from '@context/community-filters.context';
import { useDebounce } from '@helpers/debounce.helper';
import { AuthContext } from '@context/auth.context';
import IsMemberHelper from '@helpers/company/is-member.helper';
import IsMemberOwnerHelper from '@helpers/company/is-member-owner.helper';
import AvatarComponent from '@shared-components/avatar.component';
import checkPermsHelper from '@helpers/checkPerms.helper';
import GroupService from '@service/group.service';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import TableComponent from '@shared-components/table.component';
import GoTo from './goto.component';
import { defaultCommunityRedirect } from '../../../components/mainMenu/main-menu.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		sendIcon: {},
		avatar: {
			width: 64,
			height: 64,
		},
		textSecondary: {
			fontSize: 13,
			color: theme.palette.grey.A700,
			width: '100%',
			display: 'inline-block',
		},
		textCreatedBy: {
			fontSize: 13,
			color: theme.palette.primary.main,
			width: '100%',
			display: 'inline-block',
			textDecoration: 'none',
		},
		textPrimary: {
			fontSize: 15,
			paddingTop: 5,
		},
		textPrimaryLaptop: {
			fontSize: 15,
		},
		locationIcon: {
			color: theme.palette.primary.main,
			fontSize: 13,
			marginRight: 5,
			marginBottom: -2,
		},
		membersCountWrapper: {
			color: theme.palette.primary.main,
			fontSize: 15,
		},
		membersCountIcon: {
			marginBottom: -5,
			fontSize: 20,
			marginRight: 5,
		},
	})
);

export default function CommunityGroupListComponent() {
	const classes = useStyles({});
	const navigate = useNavigate();
	const groupService = new GroupService();
	const { authBody, isSuperAdmin, isBrandAdmin } = useContext(AuthContext);
	const { communityFilters } = useContext(CommunityFiltersContext);
	const [data, setData] = useState<GroupInterface[]>([]);
	const filtersDebounced = useDebounce(communityFilters, 500);

	if (!checkPermsHelper(['Enable Group Tab'], ['Community Groups'], authBody)) navigate(defaultCommunityRedirect(authBody));

	const theme = useTheme();
	const isLaptop = useMediaQuery(theme.breakpoints.only('lg'));

	const onDelete = (id: number | undefined) => {
		if (!id) return;
		setData(data.filter((c) => c.id !== id));
	};

	const makeMember = async (group: GroupInterface) => {
		if (!authBody) return;
		const clone = data;

		const companyIndex = data.findIndex((c: GroupInterface) => c.id === group.id);

		if (!IsMemberHelper(group, authBody.id)) {
			const member = await groupService.addMember(group.id, authBody.id);
			clone[companyIndex].members.push(member);
		} else {
			await groupService.deleteMember(group.id, authBody.id);
			const memberIndex = data[companyIndex].members.findIndex((m: GroupMemberInterface) => m.userId === authBody.id);
			clone[companyIndex].members.splice(memberIndex, 1);
		}
		setData([...clone]);
	};

	const joinBtns = (group: GroupInterface) => {
		if (!authBody) return;
		if (IsMemberOwnerHelper(group, authBody.id)) return <></>;

		if (!IsMemberHelper(group, authBody.id))
			return (
				<Button onClick={() => makeMember(group)} variant="contained" color="primary" startIcon={<GroupAddIcon />}>
					JOIN
				</Button>
			);
		return (
			<Button onClick={() => makeMember(group)} color="secondary" variant="contained" startIcon={<CloseIcon />}>
				cancel request
			</Button>
		);
	};

	const columns: GridColDef[] = [
		{
			field: 'logo',
			width: 90,
			sortable: false,
			valueGetter: (cellParams: GridRenderCellParams) => {
				const { row } = cellParams;
				return (
					<AvatarComponent
						className={classes.avatar}
						src={row.photos.length ? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${row.photos[0].url}` : undefined}
						altText={row.name}
					/>
				);
			},
		},
		{
			field: 'name',
			flex: 1,
			sortable: false,
			valueGetter: (cellParams: GridRenderCellParams) => {
				const { row } = cellParams;
				return (
					<>
						<Typography component="p" className={isLaptop ? classes.textPrimaryLaptop : classes.textPrimary}>
							{row.name}
						</Typography>
						<Typography component="span" className={classes.textSecondary}>
							<RoomIcon className={classes.locationIcon} />
							{row.brand ? row.brand.name : ''}
						</Typography>
						{row.createdBy && (
							<>
								<br />
								<Typography component={Link} to={`/community/members/${row.createdBy.id}`} className={classes.textCreatedBy}>
									Created by {row.createdBy.firstname} {row.createdBy.lastname}
								</Typography>
							</>
						)}
					</>
				);
			},
		},
		{
			field: 'members',
			width: 120,
			sortable: false,
			valueGetter: (cellParams: GridRenderCellParams) => {
				const { row: company } = cellParams;
				return (
					<Typography className={classes.membersCountWrapper}>
						<GroupIcon className={classes.membersCountIcon} />
						{pluralize('members', company.members.length + 1, true)}
					</Typography>
				);
			},
		},
		{
			field: 'btns',
			width: 270,
			align: 'center',
			sortable: false,
			valueGetter: (cellParams: GridRenderCellParams) => {
				const { row: company } = cellParams;
				return joinBtns(company);
			},
		},
		{
			field: 'actions',
			sortable: false,
			width: 200,
			headerName: '',
			valueGetter: (cellParams: GridRenderCellParams) => {
				const { row } = cellParams;
				return <GoTo group={row} onDelete={onDelete} />;
			},
		},
	];

	const doSearch = async (filters: any) => groupService.list(filters);

	return (
		<>
			<Paper>
				<TableComponent
					doSearch={doSearch}
					filters={filtersDebounced}
					columns={columns}
					disableColumnMenu
					disableColumnFilter
					title="Groups"
					showSearch={!isSuperAdmin && !isBrandAdmin}
				/>
			</Paper>

			<br />
		</>
	);
}
