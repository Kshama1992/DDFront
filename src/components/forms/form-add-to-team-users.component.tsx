import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TeamInterface from 'dd-common-blocks/dist/interface/team.interface';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import { AuthContext } from '@context/auth.context';
import { SnackBarContext } from '@context/snack-bar.context';
import TeamService from '@service/team.service';
import UserChipsBlock from '@forms/blocks/user-chips';
import LoadingButton from '@forms/elements/loading-button.component';
import AutocompleteAsync from '@forms/elements/autocomplete-async.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		form: {
			display: 'flex',
			flexDirection: 'column',
			margin: 'auto',
			width: '100%',
			'& .MuiFormLabel-root': {
				top: -10,
			},
		},
		formControl: {
			width: '100%',
		},
		container: {},
		errorText: {
			textAlign: 'center',
			margin: '15px 0',
			color: 'red',
		},
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			color: '#fff',
		},
		error: {
			color: 'red',
			position: 'relative',
			fontSize: 14,
			top: 10,
		},
	})
);

function FormAddToTeamUsersComponent({
	onDone,
	onCancel,
	open,
	teamId,
	brandId,
}: {
	brandId?: number | string;
	teamId?: number;
	onCancel?: () => void;
	onDone?: () => void;
	open: boolean;
}) {
	const classes = useStyles({});
	const teamService = new TeamService();
	const { authBody, isSuperAdmin, isBrandAdmin } = useContext(AuthContext);
	const { showSnackBar } = useContext(SnackBarContext);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [teams, setTeams] = useState<TeamInterface[]>([]);
	const [users, setUsers] = useState<UserInterface[]>([]);

	const { handleSubmit, control } = useForm<{ brandId: number | string; teamId?: number }>({
		defaultValues: {
			brandId: !isSuperAdmin ? authBody?.brandId : undefined,
		},
	});

	const loadTeams = useCallback(async () => {
		try {
			const options: { teamLeadId?: string | number; brandId?: string | number; includeIds?: number[] } = {};
			if (!isSuperAdmin && !isBrandAdmin) options.teamLeadId = authBody?.id;
			else if (isBrandAdmin) options.brandId = authBody?.brandId;
			if (teamId) options.includeIds = [teamId];
			const [teamsList] = await teamService.list(options);
			setTeams(teamsList);
		} catch (e) {
			console.error(e);
		}
	}, []);

	useEffect(() => {
		loadTeams().then();
	}, []);

	const save = async (formData: any) => {
		try {
			setIsSaving(true);
			await Promise.all(users.map(async (u) => teamService.addMember(teamId || formData.teamId, u.id)));
			showSnackBar('User was added to team!');
			if (onDone) onDone();
		} catch (e) {
			showSnackBar((e as Error).message);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Dialog fullWidth maxWidth="xs" open={open} onClose={onCancel} aria-labelledby="form-dialog-title" scroll="body">
			<form onSubmit={handleSubmit(save)} className={classes.form}>
				<DialogTitle id="form-dialog-title">Add users to team</DialogTitle>
				<DialogContent dividers>
					<Grid container spacing={3} className={classes.container}>
						{!brandId && (
							<Grid item xs={12}>
								<Controller
									name="brandId"
									rules={{ required: 'Field is required' }}
									control={control}
									render={({ field }) => (
										<AutocompleteAsync type="brand" label="Brand" {...field} disabled={!isSuperAdmin || !!brandId} />
									)}
								/>
							</Grid>
						)}

						{!teamId && (
							<Grid item xs={12}>
								<FormControl fullWidth>
									<InputLabel id="select-team-label">Team</InputLabel>
									<Controller
										render={({ field }) => (
											<Select labelId="select-team-label" displayEmpty variant="outlined" disabled={!!teamId} {...field}>
												{teams.map((i: TeamInterface) => (
													<MenuItem value={i.id} key={i.id}>
														{i.name}
													</MenuItem>
												))}
											</Select>
										)}
										name="teamId"
										control={control}
										rules={{ required: 'This field is Required' }}
									/>
								</FormControl>
							</Grid>
						)}

						<Grid item xs={12}>
							<UserChipsBlock showLabel={false} onChange={setUsers} />
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button
						variant="contained"
						color="secondary"
						type="button"
						size="large"
						disabled={isSaving}
						style={{ marginRight: 15 }}
						onClick={onCancel}
					>
						Cancel
					</Button>

					<LoadingButton text="Add" size="large" isLoading={isSaving} />
				</DialogActions>
				<Backdrop className={classes.backdrop} open={isSaving} onClick={() => setIsSaving(false)}>
					<CircularProgress color="inherit" />
				</Backdrop>
			</form>
		</Dialog>
	);
}

export default FormAddToTeamUsersComponent;
