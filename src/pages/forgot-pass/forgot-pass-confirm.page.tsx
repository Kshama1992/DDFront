import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthContext } from '@context/auth.context';
import { resetAuthHelper } from '@helpers/auth.helper';
import AuthService from '@service/auth.service';
import EmptyPage from '../empty.page';
import ForgotPassStyles from './style/forgot-pass.style';

export default function ForgotPasswordConfirmPage() {
	const classes = ForgotPassStyles({});
	const authService = new AuthService();
	const { token } = useParams();
	const [done, setDone] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isError, setIsError] = useState<boolean>(false);
	const { currentBrand } = useContext(AuthContext);

	resetAuthHelper();

	const checkToken = async () => {
		try {
			await authService.forgotPasswordValidate({ token });
		} catch (e) {
			setIsError(true);
		} finally {
			setIsLoading(false);
		}
	};
	useEffect(() => {
		resetAuthHelper();
		checkToken().then();
	}, []);

	const doReset = async () => {
		setIsError(false);
		setIsLoading(true);

		try {
			await authService.forgotPasswordConfirm({ token });
			setDone(true);
		} catch (error) {
			setIsError(true);
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

					{!done && (
						<>
							{!isLoading && !isError && (
								<>
									<div className={classes.brnWrapper}>
										<Button
											disabled={isLoading}
											onClick={doReset}
											className={isLoading ? classes.buttonSignInLoading : classes.buttonSignIn}
											type="submit"
										>
											Reset password
										</Button>
										{isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
									</div>
								</>
							)}

							{!isLoading && isError && (
								<Typography variant="subtitle2" style={{ color: 'red' }}>
									Wrong url or expired!
								</Typography>
							)}
						</>
					)}

					{done && <Typography variant="subtitle2">New password was sent to your email!</Typography>}
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
