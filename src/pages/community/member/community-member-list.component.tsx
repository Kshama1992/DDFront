import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Theme, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import createStyles from '@mui/styles/createStyles';
import dayjs, { extend } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsutc from 'dayjs/plugin/utc';
import dayjstimezone from 'dayjs/plugin/timezone';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import Typography from '@mui/material/Typography';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import RoomIcon from '@mui/icons-material/Room';
import { useNavigate } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import Paper from '@mui/material/Paper';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import CircularProgress from '@mui/material/CircularProgress';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import TeamInterface from 'dd-common-blocks/dist/interface/team.interface';
import SubscriptionInterface from 'dd-common-blocks/dist/interface/subscription.interface';
import CompanyInterface from 'dd-common-blocks/dist/interface/company.interface';
import TeamMemberInterface from 'dd-common-blocks/dist/interface/team-member.interface';
import { SnackBarContext } from '@context/snack-bar.context';
import SelectTeamDialog from '@shared-components/select-team.dialog';
import { CommunityFiltersContext } from '@context/community-filters.context';
import { AuthContext } from '@context/auth.context';
import AvatarComponent from '@shared-components/avatar.component';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import TableComponent from '@shared-components/table.component';
import { capitalize } from '@mui/material/utils';
import UserService from '@service/user.service';
import TeamService from '@service/team.service';
import checkPermsHelper from '@helpers/checkPerms.helper';
import { getCurrencySymbol, getInvoiceNumber, SecondsToTimeHelper } from 'dd-common-blocks';
import { defaultCommunityRedirect } from '../../../components/mainMenu/main-menu.component';
import GoTo from './goto.component';

extend(customParseFormat);
extend(dayjsutc);
extend(dayjstimezone);
extend(advancedFormat);

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			maxWidth: '100%',
			position: 'relative',
			'& .MuiInput-input': {
				border: 'none',
			},

			[theme.breakpoints.only('lg')]: {
				'.MuiTableCell-body': {
					wordBreak: 'break-word',
					maxWidth: 150,
				},
			},
		},
		sendIconBtn: {},
		addToTeamIconBtn: {
			backgroundColor: 'green',
		},
		delFromTeamIconBtn: {
			backgroundColor: 'red',
		},
		sendIcon: {},
		textSecondary: {
			fontSize: 13,
			color: '#a0a0a1',
		},
		textPrimary: {
			fontSize: 15,
			paddingTop: 15,
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
		loaderWrapper: {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			background: 'rgba(255,255,255,0.31)',
			zIndex: 9,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		exportBtn: {
			position: 'absolute',
			top: 7,
			right: 18,
			padding: '6px 16px',
			zIndex: 3,
			[theme.breakpoints.down('md')]: {
				top: -55,
				left: 0,
				right: 'auto',
				width: '100%',
				padding: '11px 24px',
			},
		},
	})
);

export default function CommunityMembersListComponent() {
	const classes = useStyles();
	const userService = new UserService();
	const teamService = new TeamService();
	const { isSuperAdmin, isBrandAdmin, authBody, currentBrand } = useContext(AuthContext);
	const { communityFilters, setCommunityFilters } = useContext(CommunityFiltersContext);
	const [isLoading, setIsLoading] = useState(false);
	const [showTeamsSelect, setShowTeamsSelect] = useState(false);
	const { showSnackBar } = useContext(SnackBarContext);
	const navigate = useNavigate();

	const [selectedUserId, setSelectedUserId] = useState<string | undefined>();

	const [leadingTeams, setLeadingTeams] = useState<TeamInterface[]>([]);

	if (!checkPermsHelper(['Enable Member Tab'], ['Community Members'], authBody)) navigate(defaultCommunityRedirect(authBody));

	const theme = useTheme();
	const isLaptop = useMediaQuery(theme.breakpoints.only('lg'));

	const loadTeams = useCallback(async () => {
		try {
			const [loadedTeams] = await teamService.list({ limit: 130, teamLeadId: authBody?.id });
			setLeadingTeams(loadedTeams);
		} catch (e) {
			console.error(e);
		}
	}, []);

	const handleAddTeamMember = async (teamId: number | undefined, userId: number | undefined) => {
		if (typeof teamId === 'undefined' || typeof userId === 'undefined') return;
		try {
			await teamService.addMember(teamId, userId);
			showSnackBar('Member added');
			await loadTeams();
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		}
	};
	const handleAddToTeam = async (userId: number | undefined) => {
		if (typeof userId === 'undefined') return;

		if (leadingTeams.length === 1) {
			await handleAddTeamMember(leadingTeams[0].id, userId);
		}
		if (leadingTeams.length > 1) {
			setSelectedUserId(String(userId));
			setShowTeamsSelect(true);
		}
	};

	const handleDeleteFromTeam = async (userId: number | undefined) => {
		if (typeof userId === 'undefined') return;

		try {
			const userTeam = leadingTeams.find((t) => !!t.members!.find((m) => m.memberId === Number(userId)));
			if (typeof userTeam === 'undefined') {
				showSnackBar('No team');
				return;
			}
			await teamService.deleteMember(userTeam.id, userId);
			showSnackBar('Member deleted');
			await loadTeams();
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		}
	};

	const handleAddToTeamDialog = async (teamId?: string) => {
		if (teamId && selectedUserId) {
			await handleAddTeamMember(Number(teamId), Number(selectedUserId));
		}
		setSelectedUserId(undefined);
		setShowTeamsSelect(false);
	};

	useEffect(() => {
		if (!isBrandAdmin && !isSuperAdmin) loadTeams().then();
	}, []);

	const isUserInTeam = (userId: number | undefined) => !!leadingTeams.find((t) => !!t.members!.find((m) => m.memberId === Number(userId)));

	const calculateUserHoursTotal = (user: UserInterface, type: 'used' | 'given'): number => {
		if (!user.subscriptions || !user.subscriptions.length) return 0;

		const count = user.subscriptions
			.map((s: SubscriptionInterface) => {
				if (!s || !s.creditHours || s.creditHours.length === 0) return 0;

				if (type === 'used')
					// @ts-ignore
					return (
						s
							// @ts-ignore
							.creditsRotation!.filter((cr) => cr.userId === user.id && cr.rotationType === 'space')
							// @ts-ignore
							.map((cr) => cr.amount)
							.reduce((a: number | undefined, b: number | undefined) => Number(a) + Number(b), 0)
					);

				return s.creditHours.map((h) => h.given).reduce((a: number | undefined, b: number | undefined) => Number(a) + Number(b), 0);
			})
			.reduce((a: number | undefined, b: number | undefined) => Number(a) + Number(b), 0);
		return count || 0;
	};

	const decodeHTML = (html: string) => {
		const txt = document.createElement('textarea');
		txt.innerHTML = html;
		return txt.value;
	};

	const exportAsExcelFile = async () => {
		setIsLoading(true);
		const xlsx = await import('xlsx');

		// @ts-ignore
		const [items] = await userService.list({
			...communityFilters,
			limit: 9999999,
			offset: 0,
			withSubscriptions: isSuperAdmin || isBrandAdmin,
			excludeSelf: true,
			withCards: true,
			withRole: true,
			withInvoices: true,
			withCompanies: true,
			withTeams: true,
		});

		// @ts-ignore
		// eslint-disable-next-line arrow-body-style
		const exportData = items.map((u, i) => {
			// @ts-ignore
			const { firstname, lastname, email, phone, username, about, latestInvoice, status, teamMembership, createdAt, teams, companies } = u;

			const roleName = u.role ? u.role.name : '';
			const brandName = u.brand ? u.brand.name : '';
			const subscriptions = u.subscriptions && u.subscriptions.length ? u.subscriptions.map((c) => c.name) : [];

			const thisULeadingTeams = teams?.filter((t: TeamInterface) => t.teamLeadId === u.id);

			let memberTypeString = 'None';

			if (thisULeadingTeams && thisULeadingTeams.length) memberTypeString = 'Team Lead';

			if (thisULeadingTeams && teams && thisULeadingTeams.length < teams.length) {
				if (memberTypeString !== 'None') {
					memberTypeString += ' and Team Member';
				} else {
					memberTypeString = 'Team Member';
				}
			}
			const inv = {
				'#': i + 1,
				'First name': firstname,
				'Last name': lastname,
				Email: email,
				Phone: phone,
				Username: username,
				Brand: brandName,
				Role: roleName,
				About: about,
				Membership: subscriptions.join('\r\n'),
				'Last Invoice Number': '',
				'Last Invoice Price': '',
				'Last Invoice Date': '',
				Status: status,
				'Member Join Date': dayjs(createdAt).format('MMMM D, YYYY'),
				'Member Type': memberTypeString,
				'Team Name': teamMembership ? teamMembership.map((t: TeamMemberInterface) => t.team!.name).toString() : '',
				'Company Name': companies ? companies.map((c: CompanyInterface) => c.name).toString() : '',
			};

			if (latestInvoice) {
				let cost = latestInvoice && (latestInvoice.paidAmount ? latestInvoice.paidAmount : 0);
				if (latestInvoice && latestInvoice.subTotal) {
					cost = `${decodeHTML(getCurrencySymbol(latestInvoice.currency))}${
						(latestInvoice.tax ? (latestInvoice.subTotal * latestInvoice.tax) / 100 : 0) + latestInvoice.subTotal
					}`;
				}

				inv['Last Invoice Number'] = `${getInvoiceNumber(latestInvoice)}`;
				inv['Last Invoice Price'] = cost;
				if (latestInvoice.reservation) {
					const tzUser = latestInvoice.reservation?.tzLocation;
					const isUSA = tzUser && tzUser.indexOf('America') !== -1;
					inv['Last Invoice Date'] = dayjs(latestInvoice.reservation.bookedAt)
						.tz(latestInvoice.reservation.tzLocation)
						.format(`YYYY-MM-DD ${isUSA ? 'hh:mm A' : 'HH:mm'} z`);
				}
			}

			return inv;
		});

		const wb = xlsx.utils.book_new();

		const ws = xlsx.utils.json_to_sheet(exportData);

		ws['!cols'] = [
			{ width: 5 },
			{ width: 20 },
			{ width: 20 },
			{ width: 20 },
			{ width: 20 },
			{ width: 20 },
			{ width: 20 },
			{ width: 20 },
			{ width: 30 },
			{ width: 30 },
			{ width: 10 },
			{ width: 10 },
			{ width: 30 },
			{ width: 10 },
			{ width: 30 },
			{ width: 30 },
			{ width: 40 },
			{ width: 40 },
		];

		if (wb)
			wb.Props = {
				Title: `${currentBrand && currentBrand.name} Members export`,
				Subject: `${currentBrand && currentBrand.name} Members export`,
				Author: 'DropDesk',
				CreatedDate: new Date(),
			};

		xlsx.utils.book_append_sheet(wb, ws, 'User export');
		xlsx.writeFile(wb, `User_export.xlsx`);
		setIsLoading(false);
	};

	const getUserSubscriptionsString = (subscriptions: SubscriptionInterface[] | undefined) => {
		if (!subscriptions || !subscriptions.length) return '';
		return subscriptions
			.filter((s: SubscriptionInterface) => s.isOngoing)
			.map((s: SubscriptionInterface, k1: number) => (
				<div key={k1}>
					<span>{s.name}</span>
					<br />
				</div>
			));
	};

	const columns: GridColDef[] = [
		{
			field: 'logo',
			width: 90,
			sortable: false,
			headerName: isSuperAdmin || isBrandAdmin ? 'Member' : undefined,
			valueGetter: ({ row: user }: GridRenderCellParams) => (
				<AvatarComponent src={user.photo ? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${user.photo.url}` : undefined} altText={user.firstname} />
			),
		},
		{
			field: 'name',
			flex: 1,
			sortable: false,
			valueGetter: ({ row: user }: GridRenderCellParams) => (
				<>
					<Typography component="p" className={isLaptop ? classes.textPrimaryLaptop : classes.textPrimary}>
						{user.firstname} {user.lastname}
					</Typography>
					<Typography component="span" className={classes.textSecondary}>
						<RoomIcon className={classes.locationIcon} />
						{user.brand && user.brand.name}
					</Typography>
				</>
			),
		},
		{
			field: 'membership',
			flex: 1,
			sortable: false,
			headerName: isSuperAdmin || isBrandAdmin ? 'Membership' : undefined,
			hide: !(isSuperAdmin || isBrandAdmin),
			valueGetter: ({ row: user }: GridRenderCellParams) => getUserSubscriptionsString(user.subscriptions),
		},
		{
			field: 'hoursGiven',
			width: 80,
			sortable: false,
			headerName: isSuperAdmin || isBrandAdmin ? 'Hours' : undefined,
			hide: !(isSuperAdmin || isBrandAdmin),
			valueGetter: ({ row: user }: GridRenderCellParams) => SecondsToTimeHelper(calculateUserHoursTotal(user, 'given') * 60 * 60, true),
		},
		{
			field: 'hoursUsed',
			width: 80,
			sortable: false,
			headerName: isSuperAdmin || isBrandAdmin ? 'Hours used' : undefined,
			hide: !(isSuperAdmin || isBrandAdmin),
			valueGetter: ({ row: user }: GridRenderCellParams) => SecondsToTimeHelper(calculateUserHoursTotal(user, 'used') * 60 * 60, true),
		},
		{
			field: 'status',
			width: 120,
			sortable: false,
			headerName: isSuperAdmin || isBrandAdmin ? 'Status' : undefined,
			hide: !(isSuperAdmin || isBrandAdmin),
			valueGetter: ({ row: user }: GridRenderCellParams) => capitalize(user.status),
		},
		{
			field: 'sendMessage',
			sortable: false,
			align: 'center',
			width: 80,
			headerName: '',
			hide: !checkPermsHelper(['Customer Messages'], [], authBody),
			valueGetter: () => (
				<Fab color="primary" size="small" className={classes.sendIconBtn}>
					<MailOutlineIcon className={classes.sendIcon} />
				</Fab>
			),
		},
		{
			field: 'leadingTeams',
			sortable: false,
			width: 80,
			align: 'center',
			headerName: '',
			hide: !leadingTeams.length,
			valueGetter: ({ row: user }: GridRenderCellParams) =>
				isUserInTeam(user.id) ? (
					<Fab color="primary" onClick={() => handleDeleteFromTeam(user.id)} size="small" className={classes.delFromTeamIconBtn}>
						<PersonAddDisabledIcon />
					</Fab>
				) : (
					<Fab color="primary" onClick={() => handleAddToTeam(user.id)} size="small" className={classes.addToTeamIconBtn}>
						<PersonAddIcon />
					</Fab>
				),
		},
		{
			field: 'actions',
			sortable: false,
			width: 200,
			headerName: '',
			valueGetter: ({ row: user }: GridRenderCellParams) => (
				<GoTo user={user} doRefresh={() => setCommunityFilters({ type: 'searchString', payload: '' })} />
			),
		},
	];

	const doSearch = async (filters: any) => userService.list(filters);

	return (
		<Paper className={classes.root}>
			{(isBrandAdmin || isSuperAdmin) && (
				<Button
					startIcon={<ImportExportIcon />}
					variant="outlined"
					color="primary"
					className={classes.exportBtn}
					onClick={() => exportAsExcelFile()}
				>
					Export members
				</Button>
			)}
			<TableComponent
				doSearch={doSearch}
				filters={{ ...communityFilters, withSubscriptions: isSuperAdmin || isBrandAdmin, excludeSelf: true }}
				columns={columns}
				disableColumnMenu
				disableColumnFilter
				title="Members"
				showSearch={!isSuperAdmin && !isBrandAdmin}
			/>

			{isLoading && (
				<div className={classes.loaderWrapper}>
					<CircularProgress />
				</div>
			)}

			{leadingTeams.length > 0 && (
				<SelectTeamDialog
					value={String(leadingTeams[0].id)}
					teamLeadId={String(authBody?.id)}
					open={showTeamsSelect}
					onClose={handleAddToTeamDialog}
				/>
			)}
		</Paper>
	);
}
