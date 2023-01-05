import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { parse as parseQueryString } from 'query-string';
import { Helmet } from 'react-helmet';
import { compare } from 'bcryptjs';
import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import { generateSlug, getSpaceUrl } from 'dd-common-blocks';
import PackageShow from 'dd-common-blocks/dist/type/PackageShow';
import { AuthContext } from '@context/auth.context';
import { SnackBarContext } from '@context/snack-bar.context';
import { getCookieUserHelper, setUserDataHelper } from '@helpers/auth.helper';
import { APP_DOMAIN, DEFAULT_BRAND_NAME } from '@core/config';
import UserService from '@service/user.service';
import SpaceService from '@service/space.service';
import FormSendSMSComponent from '@forms/form-send-sms.component';
import FormVerifyCodeComponent from '@forms/form-verify-code.component';
import { isSuperAdmin } from '@helpers/user/is-admin.helper';
import FormSignUpComponent from '@forms/form-sign-up.component';
import FormSignInUsernameComponent from '@forms/form-sign-in-username.component';
import EmptyPage from '../empty.page';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			height: '100vh',
			'& .react-tel-input .form-control': {
				border: 'none',
				borderBottom: '2px solid #3698e3',
				borderRadius: 0,
				padding: '10px 14px 5px 58px',
				marginBottom: 15,
			},
			'& .react-tel-input .selected-flag .flag': { marginTop: -17 },
			'& .react-tel-input .form-control:focus': {
				boxShadow: 'none',
			},
			'& .react-tel-input .selected-flag': {
				paddingLeft: 0,
			},
			'& .react-tel-input .form-control + div:before': {
				display: 'none',
			},
			'& .MuiInput-root': {
				background: 'transparent',
			},
		},
		title: {
			fontSize: 30,
			fontWeight: 400,
			margin: '-150px 0 30px',
		},
		signInForm: {
			maxWidth: 600,
			width: '100%',
			// display: 'block,',
			margin: '0 auto',
			// marginTop: '10%',
			boxSizing: 'border-box',
			padding: '35px 60px',
			textAlign: 'center',
			[theme.breakpoints.down('md')]: {
				position: 'absolute',
				top: 0,
				left: 0,
				borderRadius: 0,
				height: '100vh',
				maxWidth: '100%',
				'& .react-tel-input .form-control': {
					width: '100%',
				},
			},
		},
		signInLogo: {
			width: 200,
			display: 'block',
			margin: '0 auto',
			marginBottom: 30,
		},
		signUpLink: {
			color: theme.palette.primary.main,
			textDecoration: 'none',
			cursor: 'pointer',
			'&:hover': {
				textDecoration: 'underline',
			},
			[theme.breakpoints.down('md')]: {
				textDecoration: 'underline',
			},
		},
		backBtn: {
			display: 'none',
			[theme.breakpoints.down('md')]: {
				display: 'block',
				position: 'absolute',
				top: 25,
				left: 15,
			},
		},
	})
);

export default function SignUpPage() {
	const classes = useStyles({});

	const userService = new UserService();
	const spaceService = new SpaceService();

	const { search } = useLocation();
	const navigate = useNavigate();
	const queryParams = parseQueryString(search);

	const { userLocation, currentBrand, logOut } = useContext(AuthContext);
	const { showSnackBar } = useContext(SnackBarContext);

	const [usernameVisible, setUsernameVisible] = useState<boolean>(false);
	const [phoneNumberFormatted, setPhoneNumberFormatted] = useState<string>('');
	const [signUpVisible, setSignUpVisible] = useState<boolean>(false);
	const [codeSent, setCodeSent] = useState<boolean>(false);

	useEffect(() => {
		logOut(false);
	}, []);

	const decodeToken = async (): Promise<UserInterface | undefined> => {
		try {
			const { id } = getCookieUserHelper();
			if (typeof id === 'undefined') return;
			return await userService.single(id);
		} catch (e) {
			const error = e as Error;
			console.error(error);
			showSnackBar(error.message);
			return undefined;
		}
	};

	// set token for redirect domain (subdomain) to avoid redirects back to sign page
	const handleRedirects = async (profile: UserInterface, type: 'sign-up' | 'sign-in') => {
		let redirectDomain = `${window.location.protocol}//${String(APP_DOMAIN)}`;
		if (window.location.hostname !== 'localhost' && profile.brand!.domain && profile.brand!.domain !== '') {
			redirectDomain = `${window.location.protocol}//${profile.brand!.domain}.${APP_DOMAIN}`;
		}

		let goToUrl = redirectDomain;

		const isTeamLead: string | false = queryParams.teamLead ? String(queryParams.teamLead) : false;
		const teamId: string | false = queryParams.teamId ? String(queryParams.teamId) : false;
		const goToMembership: string | false = queryParams.isFromMembership ? String(queryParams.isFromMembership) : false;
		const spaceVisibility: string = queryParams.spaceVisibility ? String(queryParams.spaceVisibility) : '';
		const fromSpaceId: string | null = queryParams.fromSpaceId ? String(queryParams.fromSpaceId) : null;

		if (queryParams.redirect && queryParams.redirect !== '/sign') {
			goToUrl = `${redirectDomain}${String(queryParams.redirect)}`;
			if (type === 'sign-in' && goToMembership) {
				goToUrl += '&showCheckout=true';
			}
		}

		if (!queryParams.redirect && (profile.isAdmin || isSuperAdmin(profile))) {
			goToUrl = `${redirectDomain}/dashboard/activity`;
		}

		if (!queryParams.redirect && !profile.isAdmin && !isSuperAdmin(profile)) {
			goToUrl = `${redirectDomain}/locations/${userLocation ? generateSlug(userLocation.country) : 'united-states'}/all/all`;
		}

		// user logs in from subscription link he already has
		if ((teamId || goToMembership) && type === 'sign-in') {
			// from team invite for member
			if (teamId) {
				const userTeamSubs = profile.subscriptions?.filter((s) => s.teams?.find((t) => String(t.id) === teamId));
				if (userTeamSubs?.length) goToUrl = `${redirectDomain}/locations/`;
			}
			// membership link for lead
			if (isTeamLead && goToMembership) {
				const leadSubs = profile.subscriptions?.filter(
					(s) => String(s.spaceId) === goToMembership && s.teams?.find((t) => t.teamLeadId === profile.id)
				);
				if (leadSubs?.length) goToUrl = `${redirectDomain}/locations/`;
			}
		}

		if (
			!profile.isAdmin &&
			(type === 'sign-up' || !profile.cards?.length) &&
			(goToMembership || (spaceVisibility === PackageShow.PUBLIC && fromSpaceId))
		) {
			try {
				const memberSpace = await spaceService.single(String(goToMembership || fromSpaceId));

				const showCheckoutLink = `${getSpaceUrl(memberSpace)}${
					goToMembership ? '?isFromMembership=true&showCheckout=true' : '?showCheckout=true'
				}`;
				goToUrl = `${redirectDomain}/payment/methods?redirect='${encodeURIComponent(showCheckoutLink)}'`;
			} catch (e) {
				console.error(e);
				showSnackBar('Wrong membership url');
				goToUrl = redirectDomain;
			}
		}

		window.location.href = goToUrl;
	};

	const handleSignIn = async () => {
		const profile = await decodeToken();
		if (profile) {
			setUserDataHelper(profile);
			await handleRedirects(profile, 'sign-in');
		}
	};

	const handleSignUp = async (userData: UserInterface) => {
		if (userData) {
			setUserDataHelper(userData);
			await handleRedirects(userData, 'sign-up');
		}
	};

	const handleShowSignUp = async (accessToken: string | undefined, hash: string | undefined) => {
		if (accessToken) {
			handleSignIn().then();
		}

		if (hash) {
			if (await compare(DEFAULT_BRAND_NAME, hash)) {
				setSignUpVisible(true);
			} else {
				throw new Error('Something went wrong. Try again later');
			}
		}
	};

	const handleSMSSent = ({ formatted }: { formatted: string }) => {
		setCodeSent(true);
		setPhoneNumberFormatted(formatted);
	};

	const handleBack = () => {
		if (signUpVisible) {
			return setSignUpVisible(false);
		}
		if (usernameVisible) {
			return setUsernameVisible(false);
		}
		if (codeSent) {
			return setCodeSent(false);
		}
		return navigate(-1);
	};

	return (
		<EmptyPage>
			<Helmet>
				<title>DropDesk: Sign Up</title>
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
				{signUpVisible && (
					<Typography variant="h1" className={classes.title}>
						Sign Up to Become a Member
					</Typography>
				)}

				<Paper className={classes.signInForm}>
					<IconButton aria-label="delete" className={classes.backBtn} onClick={handleBack} size="large">
						<ChevronLeftIcon fontSize="large" color="action" />
					</IconButton>

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

					{!usernameVisible && (
						<>
							{!signUpVisible && !codeSent && (
								<FormSendSMSComponent goToUsername={() => setUsernameVisible(true)} onSuccess={handleSMSSent} />
							)}
							{!signUpVisible && codeSent && (
								<FormVerifyCodeComponent onSuccess={handleShowSignUp} phoneNumberFormatted={phoneNumberFormatted} />
							)}

							{signUpVisible && (
								<FormSignUpComponent onSuccess={handleSignUp} phoneNumber={phoneNumberFormatted.replace(/[^0-9]+/g, '')} />
							)}
						</>
					)}

					{usernameVisible && <FormSignInUsernameComponent onSuccess={handleSignIn} />}

					{usernameVisible && (
						<Grid item xs={12} sm={12}>
							<Typography variant="caption" onClick={() => setUsernameVisible(false)} className={classes.signUpLink}>
								Sign in by Phone
							</Typography>
						</Grid>
					)}
				</Paper>
			</Grid>
		</EmptyPage>
	);
}
