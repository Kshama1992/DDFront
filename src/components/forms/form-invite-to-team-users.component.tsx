import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
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
import { AuthContext } from '@context/auth.context';
import { SnackBarContext } from '@context/snack-bar.context';
import TeamService from '@service/team.service';
import LoadingButton from '@forms/elements/loading-button.component';
import FormHelperText from '@mui/material/FormHelperText';
import AutocompleteAsync from '@forms/elements/autocomplete-async.component';
import BrandFilter from 'dd-common-blocks/dist/interface/filter/brand-filter.interface';

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
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			color: '#fff',
		},
	})
);

function FormInviteToTeamUsersComponent({
	onDone,
	onCancel,
	open,
	teamId,
	brandId,
}: {
	brandId?: number;
	teamId?: number;
	onCancel?: () => void;
	onDone?: () => void;
	open: boolean;
}) {
	const classes = useStyles({});
	const teamService = new TeamService();
	const { authBody, isSuperAdmin, isBrandAdmin } = useContext(AuthContext);
	const { showSnackBar } = useContext(SnackBarContext);
	const [emailArr, setEmailArr] = useState<string[]>([]);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [teams, setTeams] = useState<TeamInterface[]>([]);

	const {
		handleSubmit,
		watch,
		control,
		setValue,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm<{ brandId?: number; teamId?: number; emailChipInput?: string }>({
		defaultValues: {
			brandId: brandId ? brandId : !isSuperAdmin ? authBody?.brandId : undefined,
			teamId: teamId || undefined,
			emailChipInput: '',
		},
	});

	const obsBrandId: number = watch('brandId');

	const loadTeams = useCallback(async (inputBrandId: number) => {
		try {
			const options: { teamLeadId?: string | number; brandId?: string | number; includeIds?: number[] } = {};
			if (!isSuperAdmin && !isBrandAdmin) options.teamLeadId = authBody?.id;
			if (teamId) options.includeIds = [teamId];
			const [teamsList] = await teamService.list({ ...options, brandId: inputBrandId });
			setTeams(teamsList);
		} catch (e) {
			console.error(e);
		}
	}, []);

	useEffect(() => {
		if (obsBrandId) loadTeams(obsBrandId).then();
	}, [obsBrandId]);

	const isInList = (email: string) => emailArr.includes(email);

	const isEmail = (email: string) => /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/.test(email);

	const isValid = (email: string): { isOK: boolean; message: string } => {
		let message = null;

		if (!email.length) return { isOK: true, message: '' };

		if (isInList(email)) {
			message = `${email} has already been added.`;
		}

		if (!isEmail(email)) {
			message = `${email} is not a valid email address.`;
		}

		if (message) {
			return { isOK: false, message };
		}

		return { isOK: true, message: '' };
	};

	const save = async (formData: any) => {
		try {
			setIsSaving(true);
			await teamService.invite({ brandId: formData.brandId, teamId: formData.teamId, emails: emailArr });
			showSnackBar('Invites sent!');
			if (onDone) onDone();
		} catch (e) {
			const { message: eMessage } = e as Error;
			showSnackBar(eMessage);
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = (item: string) => {
		setEmailArr([...emailArr.filter((i) => i !== item)]);
	};

	const handlePaste = (evt: any) => {
		evt.preventDefault();

		const paste = evt.clipboardData.getData('text');
		const emails = paste.match(/[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/g);

		if (emails) {
			const toBeAdded = emails.filter((email: string) => !isInList(email));

			setEmailArr([...emailArr, ...toBeAdded]);
		}
	};

	const handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
		if (['Enter', 'Tab', ','].includes(evt.key)) {
			evt.preventDefault();

			// @ts-ignore
			const val = evt.target.value;
			const value = val.trim();

			const { isOK, message } = isValid(value);

			if (value && isOK) {
				setEmailArr([...emailArr, value]);
				setValue('emailChipInput', '');
				clearErrors('emailChipInput');
			} else {
				setError('emailChipInput', { type: 'invalidValue', message });
			}
		}
	};

	return (
		<Dialog fullWidth maxWidth="xs" open={open} onClose={onCancel} aria-labelledby="form-dialog-title" scroll="body">
			<form onSubmit={handleSubmit(save)} className={classes.form}>
				<DialogTitle id="form-dialog-title">Invite users to team</DialogTitle>
				<DialogContent dividers>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Controller
								render={({ field }) => (
									<AutocompleteAsync
										{...field}
										type="brand"
										label="Brand"
										filter={
											{
												includeIds: brandId ? [brandId] : !isSuperAdmin ? [authBody?.brandId] : [],
											} as BrandFilter
										}
										error={errors.brandId}
										disabled={!isSuperAdmin || !!brandId}
									/>
								)}
								name="brandId"
								rules={{ required: 'Field is required' }}
								control={control}
							/>
						</Grid>

						<Grid item xs={12}>
							<FormControl fullWidth>
								<InputLabel id="select-team-label" shrink>
									Team
								</InputLabel>
								<Controller
									render={({ field }) => (
										<Select
											displayEmpty
											variant="outlined"
											{...field}
											disabled={!!teamId || !obsBrandId}
											labelId="select-team-label"
										>
											{teams.map((i: TeamInterface) => (
												<MenuItem value={i.id} key={i.id}>
													{i.name}
												</MenuItem>
											))}
										</Select>
									)}
									name="teamId"
									control={control}
									defaultValue={teamId}
									rules={{ required: 'This field is Required' }}
								/>
								{errors.teamId && <FormHelperText error>{errors.teamId.message}</FormHelperText>}
							</FormControl>
						</Grid>

						<Grid item xs={12}>
							{emailArr.map((mail: string, k: number) => (
								<Chip
									label={mail}
									key={k}
									onDelete={() => handleDelete(mail)}
									color="primary"
									variant="outlined"
									style={{ marginRight: 15, marginBottom: 15 }}
								/>
							))}

							<Controller
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										variant="outlined"
										placeholder="Type or paste email addresses and press `Enter`..."
										onKeyDown={handleKeyDown}
										onPaste={handlePaste}
										label="Email"
										InputLabelProps={{
											shrink: true,
										}}
									/>
								)}
								rules={{ validate: () => (emailArr.length > 0 ? true : 'You must add at least one email') }}
								control={control}
								name="emailChipInput"
							/>

							{errors.emailChipInput && <FormHelperText error>{errors.emailChipInput.message}</FormHelperText>}
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

					<LoadingButton text="Invite" size="large" isLoading={isSaving} />
				</DialogActions>
				<Backdrop className={classes.backdrop} open={isSaving} onClick={() => setIsSaving(false)}>
					<CircularProgress color="inherit" />
				</Backdrop>
			</form>
		</Dialog>
	);
}

export default memo(FormInviteToTeamUsersComponent);
