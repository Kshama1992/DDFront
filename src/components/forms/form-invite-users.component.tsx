import React, { memo, useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Button from '@mui/material/Button';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { SnackBarContext } from '@context/snack-bar.context';
import { AuthContext } from '@context/auth.context';
import UserService from '@service/user.service';
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

function FormInviteUsersComponent({ onDone, onCancel, open }: { onCancel?: () => void; onDone?: () => void; open: boolean }) {
	const classes = useStyles({});
	const userService = new UserService();

	const { authBody, isSuperAdmin, isBrandAdmin } = useContext(AuthContext);
	const { showSnackBar } = useContext(SnackBarContext);

	const [emailArr, setEmailArr] = useState<string[]>([]);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const [error, setError] = useState('');
	const [inputEmail, setInputEmail] = useState('');

	const { handleSubmit, control } = useForm<{ brandId: string; roleId?: string }>({
		defaultValues: {
			brandId: isBrandAdmin && authBody ? String(authBody.brandId) : undefined,
		},
	});

	const isInList = (email: string) => emailArr.includes(email);

	const isEmail = (email: string) => /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/.test(email);

	const isValid = (email: string) => {
		let emailError = null;

		if (isInList(email)) {
			emailError = `${email} has already been added.`;
		}

		if (!isEmail(email)) {
			emailError = `${email} is not a valid email address.`;
		}

		if (emailError) {
			setError(emailError);

			return false;
		}

		return true;
	};

	const save = async (formData: any) => {
		const value = inputEmail.trim();

		let tempArr = emailArr;

		if (value && isValid(value)) {
			tempArr = [...emailArr, value];

			setEmailArr(tempArr);
			setInputEmail('');
		} else {
			setError('Entered email is not valid');
			return;
		}

		setError('');
		try {
			setIsSaving(true);

			if (!tempArr.length) {
				setError('No mailing addresses entered');
				return;
			}

			await userService.invite({ brandId: formData.brandId, emails: tempArr });

			showSnackBar('Invites sent!');
			if (onDone) onDone();
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setIsSaving(false);
		}
	};

	const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		setInputEmail(evt.target.value);
		setError('');
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

			const value = inputEmail.trim();

			if (value && isValid(value)) {
				setEmailArr([...emailArr, inputEmail]);
				setInputEmail('');
			}
		}
	};

	return (
		<Dialog fullWidth maxWidth="xs" open={open} onClose={onCancel} aria-labelledby="form-dialog-title" scroll="body">
			<form onSubmit={handleSubmit(save)} className={classes.form}>
				<DialogTitle id="form-dialog-title">Invite users</DialogTitle>
				<DialogContent dividers>
					<Grid container spacing={3} className={classes.container}>
						<Grid item xs={12}>
							<Controller
								name="brandId"
								rules={{ required: 'Field is required' }}
								control={control}
								render={({ field }) => (
									<AutocompleteAsync label="Brand" type="brand" filter={{}} {...field} disabled={!isSuperAdmin} />
								)}
							/>
						</Grid>

						<Grid item xs={12}>
							{emailArr.map((mail: string, k: number) => (
								<Chip
									key={k}
									label={mail}
									onDelete={() => handleDelete(mail)}
									color="primary"
									variant="outlined"
									style={{ marginRight: 15 }}
								/>
							))}
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								variant="outlined"
								value={inputEmail}
								placeholder="Type or paste email addresses and press `Enter`..."
								onKeyDown={handleKeyDown}
								onChange={handleChange}
								onPaste={handlePaste}
								defaultValue=""
								label="Email"
								InputLabelProps={{
									shrink: true,
								}}
							/>

							{error && error !== '' && (
								<Typography component="small" className={classes.error}>
									{error}
								</Typography>
							)}
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

					<Button autoFocus variant="contained" color="primary" type="submit" size="large" disabled={isSaving}>
						Invite
					</Button>
				</DialogActions>
				<Backdrop className={classes.backdrop} open={isSaving} onClick={() => setIsSaving(false)}>
					<CircularProgress color="inherit" />
				</Backdrop>
			</form>
		</Dialog>
	);
}

export default memo(FormInviteUsersComponent);
