import React, { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import Backdrop from '@mui/material/Backdrop';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import TeamMemberStatus from 'dd-common-blocks/dist/type/TeamMemberStatus';
import TeamMemberInterface from 'dd-common-blocks/dist/interface/team-member.interface';
import { SnackBarContext } from '@context/snack-bar.context';
import { AuthContext } from '@context/auth.context';
import TeamService from '@service/team.service';
import CustomScrollbar from '@shared-components/custom-scrollbar.component';
import FormInviteToTeamUsersComponent from '@forms/form-invite-to-team-users.component';
import FormSubscriptionComponent from '@forms/form-subscription.component';
import SubscriptionService from '@service/subscription.service';
import ConfirmDialog from '@shared-components/confirm.dialog';
import { capitalize } from '@mui/material/utils';
import FormAddToTeamUsersComponent from '@forms/form-add-to-team-users.component';
import TeamFormValuesInterface from '@forms/interface/team-form-values.interface';
import BrandFilter from 'dd-common-blocks/dist/interface/filter/brand-filter.interface';
import SubFormValues from '@forms/interface/sub-form.interface';
import AutocompleteAsync from '@forms/elements/autocomplete-async.component';
import FormTeamComponentStyles from './styles/form-team.component';

function FormTeamComponent({ initialValues, needUpdate }: { initialValues?: TeamFormValuesInterface; needUpdate?: () => any }) {
	const classes = FormTeamComponentStyles({});
	const teamService = new TeamService();
	const subscriptionService = new SubscriptionService();
	const navigate = useNavigate();
	const { showSnackBar } = useContext(SnackBarContext);
	const { isSuperAdmin, authBody } = useContext(AuthContext);
	const [inviteToTeamMembersVisible, setInviteToTeamMembersVisible] = useState<boolean>(false);
	const [addToTeamMembersVisible, setAddToTeamMembersVisible] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [requestOngoing, setRequestOngoing] = useState<boolean>(false);
	const [confirmDeleteMemberDialogVisible, setConfirmDeleteMemberDialogVisible] = useState<boolean>(false);
	const [confirmAddMemberDialogVisible, setConfirmAddMemberDialogVisible] = useState<boolean>(false);
	const [deletingMember, setDeletingMember] = useState<TeamMemberInterface | undefined>(undefined);
	const [addingMember, setAddingMember] = useState<TeamMemberInterface | undefined>(undefined);
	const [subscriptionVisible, setSubscriptionVisible] = useState<boolean>(false);

	const emptyTeam: TeamFormValuesInterface = {
		name: '',
		brandId: isSuperAdmin ? '' : authBody?.brandId || '',
	};

	const {
		watch,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		defaultValues: typeof initialValues !== 'undefined' ? initialValues : emptyTeam,
	});

	const brandId = watch('brandId');

	const save = async (formData: TeamFormValuesInterface) => {
		try {
			setIsSaving(true);
			const cloneData = formData;
			const itemId = initialValues && initialValues.id ? initialValues.id : null;
			const newTeam = await teamService.save(cloneData, itemId);
			navigate(`/dashboard/team-admin/${newTeam.id}`);
			showSnackBar('Team saved!');
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setIsSaving(false);
		}
	};

	const handleDeleteFromTeam = async (userId: number | undefined) => {
		if (!userId || !initialValues) return;
		try {
			setRequestOngoing(true);
			await teamService.deleteMember(initialValues.id, userId);
			showSnackBar('Member removed from team');
			if (needUpdate) needUpdate();
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setRequestOngoing(false);
		}
	};

	const handleDeleteInvite = async (membershipId: number | undefined) => {
		if (!membershipId || !initialValues) return;
		try {
			setRequestOngoing(true);
			await teamService.deleteInvite(initialValues.id, membershipId);
			showSnackBar('Invite deleted!');
			if (needUpdate) needUpdate();
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setRequestOngoing(false);
		}
	};

	const handleInviteSent = () => {
		setInviteToTeamMembersVisible(false);
		if (needUpdate) needUpdate();
	};

	const handleAddUsers = () => {
		setAddToTeamMembersVisible(false);
		if (needUpdate) needUpdate();
	};

	const saveSubscription = async (sub: SubFormValues) => {
		await subscriptionService.save(sub, sub.id);
		setSubscriptionVisible(false);
		if (needUpdate) setTimeout(() => needUpdate(), 300);
	};

	const onMemberDeleteClick = (u: TeamMemberInterface) => {
		setDeletingMember(u);
		setConfirmDeleteMemberDialogVisible(true);
	};

	const onMemberReaddClick = (u: TeamMemberInterface) => {
		setAddingMember(u);
		setConfirmAddMemberDialogVisible(true);
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
				if (needUpdate) needUpdate();
			}
			setConfirmAddMemberDialogVisible(false);
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setRequestOngoing(false);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit(save)} className={classes.root}>
				<Paper>
					<Grid container spacing={0}>
						<Grid item xs={12} className={classes.backContainer}>
							<Button
								className={classes.backLink}
								onClick={() => navigate('/dashboard/team-admin')}
								startIcon={<ChevronLeftIcon className={classes.backIcon} />}
							>
								<Typography>Back to team list</Typography>
							</Button>
						</Grid>
					</Grid>

					<Grid container spacing={3} className={classes.container}>
						<Grid item xs={12} md={12}>
							<Button
								startIcon={<MailOutlineIcon />}
								variant="outlined"
								color="primary"
								className={classes.topBtn}
								onClick={() => setInviteToTeamMembersVisible(true)}
							>
								Invite to team
							</Button>

							<Button
								startIcon={<PersonAddIcon />}
								variant="outlined"
								color="primary"
								className={classes.topBtn}
								style={{ marginLeft: 15 }}
								onClick={() => setAddToTeamMembersVisible(true)}
							>
								Add to team
							</Button>

							{initialValues && (
								<Button
									startIcon={<MailOutlineIcon />}
									variant="outlined"
									color="primary"
									className={classes.topBtn}
									style={{ marginLeft: 15 }}
									onClick={() => setSubscriptionVisible(true)}
								>
									Edit subscription
								</Button>
							)}
						</Grid>
						<Grid item xs={12} md={6}>
							<Controller
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										error={!!errors.name}
										helperText={errors.name ? errors.name.message : ''}
										label="Team Name"
										InputLabelProps={{ shrink: true }}
										variant="outlined"
									/>
								)}
								rules={{ required: 'Field is required' }}
								name="name"
								control={control}
							/>
						</Grid>

						<Grid item xs={12} md={6}>
							<Controller
								render={({ field }) => (
									<AutocompleteAsync
										type="brand"
										label="Brand"
										{...field}
										filter={
											{
												includeIds: initialValues
													? [initialValues.brandId]
													: !isSuperAdmin && authBody?.brandId
													? [authBody?.brandId]
													: [],
											} as BrandFilter
										}
										disabled={!isSuperAdmin || (initialValues && !initialValues.brandId)}
									/>
								)}
								name="brandId"
								rules={{ required: 'Field is required' }}
								control={control}
							/>
						</Grid>

						{initialValues && initialValues.members && (
							<Grid item xs={12}>
								<Typography variant="body1" className={classes.label} style={{ padding: '25px 0' }}>
									Users in this team
								</Typography>
								<Divider />

								<CustomScrollbar autoHide style={{ height: 400 }}>
									<TableContainer>
										<Table aria-label="team users table">
											<TableHead>
												<TableRow>
													<TableCell>Name</TableCell>
													<TableCell>Status</TableCell>
													<TableCell>Type</TableCell>
													<TableCell align="right" />
												</TableRow>
											</TableHead>
											<TableBody>
												{initialValues.members!.map((u: TeamMemberInterface) => (
													<TableRow key={u.id}>
														<TableCell component="th" scope="row">
															{u.member ? `${u.member!.firstname} ${u.member!.lastname}` : u.email}
														</TableCell>
														<TableCell>{capitalize(u.status)}</TableCell>
														<TableCell>{!u.isTeamLead ? 'Member' : 'Team Lead'}</TableCell>
														<TableCell align="right">
															{!u.isTeamLead && u.status !== TeamMemberStatus.MEMBER_REMOVED && (
																<IconButton size="small" aria-label="delete" onClick={() => onMemberDeleteClick(u)}>
																	<DeleteIcon color="secondary" />
																</IconButton>
															)}
															{!u.isTeamLead && u.status === TeamMemberStatus.MEMBER_REMOVED && (
																<IconButton size="small" aria-label="delete" onClick={() => onMemberReaddClick(u)}>
																	<AddIcon color="primary" />
																</IconButton>
															)}
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								</CustomScrollbar>
								<Divider />
							</Grid>
						)}
					</Grid>

					{Object.keys(errors).length > 0 && (
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<Divider />
								<Typography className={classes.errorText}>You have errors in form. Please fill in all required fields.</Typography>
								<Divider />
							</Grid>
						</Grid>
					)}

					<Grid container spacing={3} className={classes.bottomWrap}>
						<Grid item xs={12} className={classes.bottomWrap}>
							<Button
								variant="contained"
								color="secondary"
								type="button"
								size="large"
								style={{ marginTop: 15, marginRight: 15 }}
								onClick={() => navigate('/dashboard/team-admin')}
							>
								Cancel
							</Button>

							<Button variant="contained" color="primary" type="submit" size="large" style={{ marginTop: 15 }}>
								Save team
							</Button>
						</Grid>
					</Grid>

					<Backdrop className={classes.backdrop} open={isSaving} onClick={() => setIsSaving(false)}>
						<CircularProgress color="inherit" />
					</Backdrop>
				</Paper>
			</form>

			<Dialog
				open={subscriptionVisible}
				maxWidth="md"
				fullWidth={true}
				onClose={() => setSubscriptionVisible(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogContent>
					<FormSubscriptionComponent
						initialValues={initialValues?.subscriptions![0]}
						onCancel={() => setSubscriptionVisible(false)}
						onSave={saveSubscription}
						user={authBody}
					/>
				</DialogContent>
			</Dialog>

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

			{initialValues?.id && brandId && (
				<FormAddToTeamUsersComponent
					open={addToTeamMembersVisible}
					teamId={initialValues?.id}
					brandId={brandId}
					onCancel={() => setAddToTeamMembersVisible(false)}
					onDone={handleAddUsers}
				/>
			)}

			{initialValues?.id && brandId && (
				<FormInviteToTeamUsersComponent
					open={inviteToTeamMembersVisible}
					teamId={initialValues?.id}
					brandId={+brandId}
					onCancel={() => setInviteToTeamMembersVisible(false)}
					onDone={handleInviteSent}
				/>
			)}
		</>
	);
}

export default FormTeamComponent;
