import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthContext } from '@context/auth.context';
import { resetAuthHelper } from '@helpers/auth.helper';
import AuthService from '@service/auth.service';
import EmptyPage from '../empty.page';
import ForgotPassStyles from './style/forgot-pass.style';

export default function ForgotPasswordPage() {
	const classes = ForgotPassStyles({});
	const authService = new AuthService();
	const [email, setEmail] = useState<string>('');
	const [emailVisible, setEmailVisible] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const [msg, setMsg] = useState<string>('');

	const { currentBrand } = useContext(AuthContext);

	const successMessage =
		'A reset link is sent to your mail if your mail exists in the system. If you didn’t receive the link, please check that you are entering your email address correctly and try again';

	resetAuthHelper();

	useEffect(() => {
		resetAuthHelper();
	}, []);

	const handleEmailChange = (event: any) => {
		// @ts-ignore
		setEmail(event.target.value);
	};

	const onSubmit = async (e: any) => {
		e.preventDefault();

		setIsError(false);
		setIsLoading(true);

		try {
			const { message } = await authService.forgotPassword({ email });
			setMsg(message);
			setEmailVisible(false);
		} catch (error) {
			setIsError(true);
			setMsg((error as Error).message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<EmptyPage>
			<Helmet>
				<title>DropDesk: Forgot password</title>
				<meta name="description" content="Sign Up" />
			</Helmet>
			<Grid
				container
				direction="column"
				justifyContent="center"
				alignItems="center"
				className={classes.root}
				style={{
					background: `url(${
						(currentBrand && currentBrand.background && `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${currentBrand.background.url}`) ||
						'/images/bg-signin.png'
					}) no-repeat center/cover`,
				}}
			>
				<Paper className={classes.signInForm}>
					<Link to="/">
						<img
							className={classes.signInLogo}
							src={
								(currentBrand && currentBrand.logo && `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${currentBrand.logo.url}`) ||
								'/images/signin-logo.png'
							}
							alt="DropDesk Logo"
						/>
					</Link>

					{emailVisible && (
						<form onSubmit={onSubmit}>
							<FormControl fullWidth style={{ maxWidth: 350 }} error={isError}>
								<Typography className={classes.signInTitle}>your email</Typography>
								<Input onChange={handleEmailChange} value={email} error={isError} />
								{isError && <FormHelperText error>{msg}</FormHelperText>}
							</FormControl>
							<br />
							<br />
							<br />
							<Typography variant="subtitle2">
								Enter the email address associated with your account and we will send you a link to reset your password
							</Typography>

							<div className={classes.brnWrapper}>
								<Button disabled={isLoading} className={isLoading ? classes.buttonSignInLoading : classes.buttonSignIn} type="submit">
									Send
								</Button>
								{isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
							</div>
						</form>
					)}

					{!emailVisible && <Typography>{successMessage}</Typography>}

					<br />
					<br />

					<Grid item xs={12} sm={12}>
						<Typography variant="caption" component={Link} to="/sign" className={classes.signUpLink}>
							Go to Sign in
						</Typography>
					</Grid>
				</Paper>
			</Grid>
		</EmptyPage>
	);
}
