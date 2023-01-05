import React, { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { SnackBarContext } from '@context/snack-bar.context';
import UserService from '@service/user.service';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../../core/config';

interface ChangePassInterface {
	password: string;
	confirmPassword: string;
}

const useStyles = makeStyles(() =>
	createStyles({
		fieldTitle: {
			fontWeight: 600,
			textTransform: 'uppercase',
			fontSize: 15,
			marginTop: 25,
		},
	})
);

function FormChangePassComponent({ onSave, userId }: { onSave: () => any; userId: string | number }) {
	const classes = useStyles({});
	const { showSnackBar } = useContext(SnackBarContext);

	const userService = new UserService();

	const [isSaving, setIsSaving] = useState<boolean>(false);

	const {
		handleSubmit,
		control,
		watch,
		formState: { errors },
	} = useForm<ChangePassInterface>({
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	const save = async (formData: ChangePassInterface) => {
		try {
			setIsSaving(true);
			await userService.changePassword(userId, formData.password);
			onSave();
			showSnackBar('Password changed');
		} catch (e) {
			showSnackBar((e as Error).message);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit(save)} style={{ padding: 25 }}>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<Typography>Change password</Typography>
					</Grid>
				</Grid>

				<Grid container spacing={3}>
					<Grid item xs={12} md={9}>
						<Typography className={classes.fieldTitle}>Password</Typography>
						<FormControl fullWidth>
							<Controller
								render={({ field }) => (
									<TextField
										{...field}
										type="password"
										variant="outlined"
										disabled={isSaving}
										error={!!errors.password}
										style={{ marginTop: 0 }}
										helperText={errors.password ? errors.password.message : ''}
									/>
								)}
								name="password"
								control={control}
								rules={{
									required: 'Field is required',
									minLength: { value: PASSWORD_MIN_LENGTH, message: `Min password length ${PASSWORD_MIN_LENGTH}` },
									maxLength: { value: PASSWORD_MAX_LENGTH, message: `Max password length ${PASSWORD_MAX_LENGTH}` },
								}}
							/>
						</FormControl>
					</Grid>

					<Grid item xs={12} md={9}>
						<Typography className={classes.fieldTitle}>Repeat Password</Typography>
						<FormControl fullWidth>
							<Controller
								render={({ field }) => (
									<TextField
										{...field}
										type="password"
										variant="outlined"
										disabled={isSaving}
										error={!!errors.confirmPassword}
										helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
										style={{ marginTop: 0 }}
									/>
								)}
								control={control}
								name="confirmPassword"
								rules={{
									validate: (value) => (value === watch('password') ? true : 'Passwords must be equal'),
									required: 'Field is required',
								}}
							/>
						</FormControl>
					</Grid>

					<Grid item xs={6}>
						<Button type="submit" variant="contained" color="primary" style={{ marginTop: 15 }}>
							Change
						</Button>
					</Grid>
				</Grid>
			</form>
		</>
	);
}

export default FormChangePassComponent;
