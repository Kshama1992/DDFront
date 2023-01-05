import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { SnackBarContext } from '@context/snack-bar.context';
import AuthService from '@service/auth.service';
import FormSignInStyles from '@forms/styles/form-sign-in.styles';
import formatPhone from '@helpers/format-phone.helper';

export default function FormVerifyCodeComponent({
	onSuccess,
	phoneNumberFormatted,
}: {
	onSuccess: (token: string | undefined, hash?: string | undefined) => void;
	phoneNumberFormatted: string;
}) {
	const classes = FormSignInStyles({});
	const authService = new AuthService();
	const { showSnackBar } = useContext(SnackBarContext);

	const { register, handleSubmit } = useForm();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const onSubmit = async (formData: any) => {
		try {
			setIsLoading(true);
			const { accessToken, hash } = await authService.verifyCode(phoneNumberFormatted.replace(/[^0-9]+/g, ''), formData.code);
			onSuccess(accessToken, hash);
		} catch (e) {
			showSnackBar((e as Error).message);
		} finally {
			setIsLoading(false);
		}
	};

	const resendSMSCode = async () => {
		try {
			setIsLoading(true);
			await authService.sendAuthCode(phoneNumberFormatted.replace(/[^0-9]+/g, ''));
			return showSnackBar(`Verification code was sent to ${phoneNumberFormatted}`);
		} catch (e) {
			return showSnackBar((e as Error).message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FormControl>
				<Typography className={classes.signInTitle} style={{ textAlign: 'center' }}>
					VERIFICATION CODE
				</Typography>

				<Typography className={classes.text} variant="subtitle2">
					Enter the code sent to <br />
					{formatPhone(phoneNumberFormatted)}
				</Typography>

				<TextField
					fullWidth
					InputLabelProps={{ shrink: true }}
					variant="outlined"
					size="small"
					autoFocus
					required
					{...register('code', { required: true })}
				/>
			</FormControl>

			<Grid container spacing={3} justifyContent="space-between">
				<Grid item xs={12} md={7} style={{ padding: 0, textAlign: 'left', marginTop: 30 }}>
					<div className={classes.brnWrapper}>
						<Button
							disabled={isLoading}
							className={isLoading ? classes.buttonSignInLoading : classes.buttonSignIn}
							type="button"
							onClick={resendSMSCode}
						>
							Resend code
						</Button>
						{isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
					</div>
				</Grid>
				<Grid item xs={12} md={5} style={{ padding: 0, textAlign: 'right', marginTop: 30 }}>
					<div className={classes.brnWrapperNext}>
						<Button disabled={isLoading} className={isLoading ? classes.buttonSignInLoading : classes.buttonSignIn} type="submit">
							Next
						</Button>
						{isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
					</div>
				</Grid>
			</Grid>
		</form>
	);
}
