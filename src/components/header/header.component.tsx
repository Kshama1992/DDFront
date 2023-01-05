import React, { useContext, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Badge from '@mui/material/Badge';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SubscriptionInterface from 'dd-common-blocks/dist/interface/subscription.interface';
import HoursType from 'dd-common-blocks/dist/type/HoursType';
import { parseQueryHelper } from '@helpers/parse-query.helper';
import { AuthContext } from '@context/auth.context';
import checkPermsHelper from '@helpers/checkPerms.helper';
import { getWebpImageUrl } from '@helpers/webp-support.helper';
import { APP_DOMAIN } from '@core/config';
import useStyles from './header-styles';
import CreditHoursStringComponent from './credit-hours-string.component';
import MobileMenuComponent from './mobile-menu.component';
import ProfileMenuComponent from './profile-menu.component';
import { MenuItemInterface, profileMenuItems } from '../mainMenu/main-menu.component';

function Header() {
	const { authBody, logOut, isBrandAdmin, isSuperAdmin, userOptions, setUserOptions, currentBrand } = useContext(AuthContext);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const user = authBody;
	const classes = useStyles({});
	const notificationCounter = 4;

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });

	const [activeSubscription, setActiveSubscription] = useState<SubscriptionInterface | undefined>();

	const [activeCreditHoursType, setActiveCreditHoursType] = useState<HoursType | undefined>(userOptions?.creditHoursType);

	const [subscriptions, setSubscriptions] = useState<SubscriptionInterface[]>([]);

	const [profileOpen, setProfileOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	useEffect(() => {
		if (authBody) {
			if (authBody.subscriptions.length) {
				const subs = authBody.subscriptions.filter((s: SubscriptionInterface) => s.isOngoing);
				if (subs.length > 0) {
					const savedSub = subs.find((s: SubscriptionInterface) => s.id === userOptions?.subscriptionId);
					setSubscriptions(subs);
					setActiveSubscription(typeof savedSub !== 'undefined' ? savedSub : subs[0]);
				}
			} else {
				setSubscriptions([]);
				setActiveSubscription(undefined);
			}
		}
	}, [authBody]);

	const doLogOut = () => {
		logOut();
	};

	const handleProfileClose = () => {
		setProfileOpen(false);
	};

	const handleMobileMenuOpen = () => {
		setMobileMenuOpen(true);
	};

	const handleMobileMenuClose = () => {
		setMobileMenuOpen(false);
	};

	const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const renderLogo = (withUrl = false) => {
		let logo = '/images/header/header_logo_user.png';
		let logoAlt = 'Dropdesk';

		if (user?.brand?.logo) {
			logo = `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${user.brand.logo.url}`;
			logoAlt = user.brand.name;
		} else if (!authBody && currentBrand && currentBrand.logo) {
			logo = `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${currentBrand.logo.url}`;
			logoAlt = currentBrand.name;
		}
		const logoHtml = <img className={classes.headerUserLogo} src={`${getWebpImageUrl(logo)}`} alt={`${logoAlt}`} />;
		if (!withUrl) return logoHtml;

		return (
			<Link to="/" className={classes.link}>
				{logoHtml}
			</Link>
		);
	};

	let isFromMembership = false;
	if (window.location) {
		const searchParams = parseQueryHelper(window.location.search);
		isFromMembership = typeof searchParams.isFromMembership !== 'undefined';
	}

	const handleHoursTypeChange = (event: SelectChangeEvent) => {
		setActiveCreditHoursType(event.target.value as HoursType);
		setUserOptions({ ...userOptions, creditHoursType: event.target.value as HoursType });
	};

	const renderUserConfHours = () => {
		if (!authBody || !subscriptions.length) return '';

		return (
			<FormControl className={classes.formControl} variant="standard">
				<InputLabel shrink className={classes.headerUserTitle}>
					<Select
						IconComponent={ExpandMoreIcon}
						value={activeCreditHoursType}
						onChange={handleHoursTypeChange}
						displayEmpty
						className={classes.selectHoursType}
					>
						<MenuItem value="" disabled>
							Credits
						</MenuItem>
						<MenuItem value="conference">Conference Credits</MenuItem>
						<MenuItem value="check-in">DropDesk Pass Credits</MenuItem>
					</Select>
				</InputLabel>
				<Typography className={classes.headerTypoText}>
					<CreditHoursStringComponent subscription={activeSubscription} hoursType={activeCreditHoursType} />
				</Typography>
			</FormControl>
		);
	};

	const renderAuthBtns = () => {
		let signUpLink = '/sign/?redirect=/membership/366?simpleMembership=true&isFromMembership=366';
		if (APP_DOMAIN === 'beta.drop-desk.com') signUpLink = '/sign/?redirect=/membership/547?simpleMembership=true&isFromMembership=547';
		if (APP_DOMAIN === 'dev.drop-desk.com') signUpLink = '/sign/?redirect=/membership/270?simpleMembership=true&isFromMembership=270';

		return (
			<div className={classes.miniContainer}>
				<div className={classes.ButtonBlock}>
					<Button component={Link} to="/sign" className={`${classes.btnBase} ${classes.signInDesktop}`}>
						SIGN IN
					</Button>
				</div>
				<div className={classes.ButtonSignup}>
					<Button
						sx={{ display: { xs: 'none', md: 'block' } }}
						component={Link}
						to={signUpLink}
						className={`${classes.btnBase} ${classes.loginDesktop}`}
					>
						SIGN UP FOR FREE
					</Button>
				</div>
			</div>
		);
	};

	const renderBookBtn = () => {
		if (isFromMembership) return '';

		return (
			<Link to="/sign" className={classes.hideHover}>
				<Fab variant="extended" style={{ outline: 'none' }} className={classes.headerUserBook}>
					Book Space
				</Fab>
			</Link>
		);
	};

	const isAdmin = () => {
		if (!authBody) return false;
		return isBrandAdmin || isSuperAdmin;
	};

	const handleSubscriptionChange = (event: SelectChangeEvent) => {
		const sub = subscriptions.find((s) => Number(s.id) === Number(event.target.value));
		setActiveSubscription(sub);
		setUserOptions({ ...userOptions, subscriptionId: Number(event.target.value) });
	};

	const subsDropDown = () => {
		if (!authBody || !subscriptions.length) return <></>;

		return (
			<FormControl className={classes.formControl} variant="standard">
				<InputLabel id="select-sub" shrink className={classes.headerUserTitle} style={{ marginLeft: 0 }}>
					membership subscription
				</InputLabel>
				<Select
					labelId="select-sub"
					onChange={handleSubscriptionChange}
					className={classes.selectFilters}
					value={activeSubscription ? String(activeSubscription.id) : ''}
					IconComponent={ExpandMoreIcon}
				>
					{!subscriptions.length && (
						<MenuItem style={{ border: 'none' }} value="" disabled classes={{ selected: classes.selectDisable }}>
							<Typography className={classes.headerUserText} style={{ whiteSpace: 'normal' }}>
								No subscriptions
							</Typography>
						</MenuItem>
					)}

					{subscriptions.map((item: SubscriptionInterface) => (
						<MenuItem classes={{ selected: classes.selectDisable }} value={item.id} key={item.id}>
							<Typography className={classes.headerUserText} style={{ whiteSpace: 'normal' }}>
								{item.name}
							</Typography>
						</MenuItem>
					))}
				</Select>
			</FormControl>
		);
	};

	return (
		<Paper className={classes.root}>
			<Grid container direction="row" justifyContent="space-between" alignItems="center">
				<Grid sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }} item xs={2} style={{ textAlign: 'center' }}>
					<IconButton onClick={handleMobileMenuOpen} size="large">
						<MenuIcon color="primary" />
					</IconButton>
				</Grid>

				<Grid item xs={8} sm={2} xl={1} style={{ textAlign: 'center' }}>
					{renderLogo(!isFromMembership)}
				</Grid>

				<Grid sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }} item xs={2} style={{ textAlign: 'center' }} />

				{!isAdmin() && (
					<Grid sx={{ display: { xs: 'none', md: 'block' } }} item xs={12} sm={authBody ? 6 : 5} xl={authBody ? 7 : 5}>
						<Grid container justifyContent="center" alignItems="center">
							{authBody && (
								<Grid item sm={3} xs={5}>
									{subsDropDown()}
								</Grid>
							)}
							{authBody && (
								<Grid item sm={3} xs={5}>
									{renderUserConfHours()}
								</Grid>
							)}
							{authBody && (
								<Grid item sm={3} xs={5}>
									{/*<AccessHoursComponent subscription={activeSubscription} />*/}
								</Grid>
							)}
							<Grid item sm={1} xs={5}>
								{/* <CurrencySelectComponent />*/}
							</Grid>
							<Grid item sm={2} xs={5}>
								{/* <GooglePlacesSelectComponent />*/}
							</Grid>
						</Grid>
					</Grid>
				)}

				{!authBody && (
					<Grid sx={{ display: { xs: 'none', md: 'block' } }} item xs={12} sm={1}>
						{renderBookBtn()}
					</Grid>
				)}

				{!authBody && !isAdmin() && (
					<Grid sx={{ display: { xs: 'none', md: 'block' } }} item xs={12} sm={4}>
						{renderAuthBtns()}
					</Grid>
				)}

				{authBody && user && (
					<Grid sx={{ display: { xs: 'none', md: 'block' } }} item xs={12} sm={2} style={{ textAlign: 'right' }}>
						<div className={classes.middleScreenHeader}>
							{checkPermsHelper([''], [''], authBody) && (
								<IconButton component={Link} to="/notifications" className={classes.headerUserNotifications} size="large">
									<Badge badgeContent={notificationCounter} color="primary">
										<NotificationsIcon />
									</Badge>
								</IconButton>
							)}

							<div onClick={handleClick} style={{ display: 'inherit', width: 'inherit' }}>
								<Typography className={classes.headerUserName}>
									{user.firstname ? user.firstname : ''} {user.lastname ? user.lastname : ''}
								</Typography>

								<div className={classes.headerUserDrop}>
									<Avatar
										alt={user.firstname ? user.firstname : ''}
										src={user.photo ? `${getWebpImageUrl(process.env.RAZZLE_RUNTIME_MEDIA_URL + user.photo.url)}` : undefined}
										className={classes.headerUserPhoto}
									/>
								</div>
							</div>
							<Menu
								anchorEl={anchorEl}
								keepMounted
								open={Boolean(anchorEl)}
								onClose={handleClose}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'center',
								}}
								transformOrigin={{
									vertical: 'top',
									horizontal: 'center',
								}}
							>
								{profileMenuItems(authBody, isFromMembership).map((item: MenuItemInterface, i: number) => {
									if (checkPermsHelper(item.customerPermissions, item.adminPermissions, authBody))
										return (
											<MenuItem key={i} component={Link} to={item.url}>
												{item.name}
											</MenuItem>
										);
									return <></>;
								})}

								<MenuItem onClick={doLogOut}>Logout</MenuItem>
							</Menu>
						</div>
					</Grid>
				)}
			</Grid>

			{authBody && !isMobile && <ProfileMenuComponent handleProfileClose={handleProfileClose} profileOpen={profileOpen} />}

			<MobileMenuComponent
				mobileMenuOpen={mobileMenuOpen}
				handleMobileMenuClose={handleMobileMenuClose}
				handleMobileMenuOpen={handleMobileMenuOpen}
			/>
		</Paper>
	);
}

export default Header;
