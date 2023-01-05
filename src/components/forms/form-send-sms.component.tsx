import React, { createRef, useContext, useState } from 'react';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { SnackBarContext } from '@context/snack-bar.context';
import { AuthContext } from '@context/auth.context';
import AuthService from '@service/auth.service';
import PhoneInputComponent from '@forms/elements/phone-input.component';
import FormSignInStyles from '@forms/styles/form-sign-in.styles';

export default function FormSendSMSComponent({
	onSuccess,
	goToUsername,
}: {
	onSuccess: ({ phone }: { phone: string; formatted: string }) => void;
	goToUsername: () => void;
}) {
	const classes = FormSignInStyles({});
	const authService = new AuthService();
	const { showSnackBar } = useContext(SnackBarContext);
	const { userLocation } = useContext(AuthContext);

	const [isPhoneValid, setIsPhoneValid] = useState(true);
	const [phoneNumber, setPhoneNumber] = useState<string>('');
	const [phoneNumberFormatted, setPhoneNumberFormatted] = useState<string>('');

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleChange = (phone: string) => {
		setPhoneNumber(phone);
		setPhoneNumberFormatted(phone);
	};

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			if (!isPhoneValid) {
				return showSnackBar('Wrong phone number');
			}

			setIsLoading(true);
			await authService.sendAuthCode(phoneNumber);
			showSnackBar(`Verification code was sent to ${phoneNumberFormatted}`);
			return onSuccess({ phone: phoneNumber, formatted: phoneNumberFormatted });
		} catch (e) {
			return showSnackBar((e as Error).message);
		} finally {
			setIsLoading(false);
		}
	};

	const ref = createRef();

	return (
		<form onSubmit={onSubmit}>
			<FormControl>
				<Typography className={classes.signInTitle}>Phone</Typography>
				<PhoneInputComponent
					ref={ref}
					autoFocus
					country={userLocation ? String(userLocation.countryCode.toLowerCase()) : 'us'}
					onValidate={(isValid) => setIsPhoneValid(isValid)}
					onChange={handleChange}
				/>
			</FormControl>
			<Typography variant="subtitle2" className={classes.text}>
				We&apos;ll send you a text to verify your phone.
			</Typography>

			<Typography variant="subtitle2" className={classes.ortext}>
				or
			</Typography>

			<Typography variant="caption" onClick={() => goToUsername()} className={classes.signUpLink}>
				Sign in by Username and Password
			</Typography>

			<div className={classes.brnWrapper}>
				<Button disabled={isLoading} className={isLoading ? classes.buttonSignInLoading : classes.buttonSignIn} type="submit">
					Next
				</Button>
				{isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
			</div>
		</form>
	);
}
