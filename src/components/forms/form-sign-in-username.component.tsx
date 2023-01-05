import React, { useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';
import { parse as parseQueryString } from 'query-string';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { SnackBarContext } from '@context/snack-bar.context';
import AuthService from '@service/auth.service';
import FormSignInStyles from '@forms/styles/form-sign-in.styles';

type FormData = {
	username: string;
	password: string;
};

export default function FormSignInUsernameComponent({ onSuccess }: { onSuccess: (accessToken: string | undefined) => void }) {
	const { search } = useLocation();
	const classes = FormSignInStyles({});
	const { handleSubmit, control } = useForm<FormData>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { showSnackBar } = useContext(SnackBarContext);
	const authService = new AuthService();
	const queryParams = parseQueryString(search);

	const onSubmit = handleSubmit(async ({ username, password }) => {
		try {
			setIsLoading(true);
			const inviteToTeamId: string | undefined = queryParams.teamId ? String(queryParams.teamId) : undefined;
			const data = await authService.login({ username, password, inviteToTeamId });
			onSuccess(data && data.accessToken ? data.accessToken : undefined);
		} catch (e) {
			showSnackBar((e as Error).message);
		} finally {
			setIsLoading(false);
		}
	});

	return (
		<form onSubmit={onSubmit} className={classes.root}>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={12}>
					<Controller
						render={({ field }) => <TextField {...field} label="Username" variant="standard" autoComplete="dd-username" />}
						rules={{ required: true }}
						name="username"
						control={control}
						defaultValue=""
					/>
				</Grid>

				<Grid item xs={12} sm={12}>
					<Controller
						name="password"
						rules={{ required: true }}
						control={control}
						defaultValue=""
						render={({ field }) => (
							<TextField {...field} label="Password" autoComplete="dd-password" variant="standard" type="password" />
						)}
					/>
				</Grid>

				<Grid item xs={12} sm={12} style={{ padding: 0 }}>
					<Typography component={Link} className={classes.signUpLink} to="/forgot-password" variant="caption">
						Forgot Password?
					</Typography>
				</Grid>

				<Grid item xs={12} sm={12}>
					<div className={classes.brnWrapper}>
						<Button disabled={isLoading} className={isLoading ? classes.buttonSignInLoading : classes.buttonSignIn} type="submit">
							Login
						</Button>
						{isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
					</div>
				</Grid>
			</Grid>
		</form>
	);
}
