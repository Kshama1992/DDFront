import React, { useContext, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import MenuIcon from '@mui/icons-material/Menu';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListItemText from '@mui/material/ListItemText';
import RoomIcon from '@mui/icons-material/Room';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SubscriptionInterface from 'dd-common-blocks/dist/interface/subscription.interface';
import HoursType from 'dd-common-blocks/dist/type/HoursType';
import { parseQueryHelper } from '@helpers/parse-query.helper';
import { SnackBarContext } from '@context/snack-bar.context';
import { AuthContext } from '@context/auth.context';
import checkPermsHelper from '@helpers/checkPerms.helper';
import AvatarComponent from '@shared-components/avatar.component';
import { APP_DOMAIN } from '@core/config';
import { adminMenuItems, menuItems, MenuItemInterface, profileMenuItems } from '../mainMenu/main-menu.component';
import CreditHoursStringComponent from './credit-hours-string.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			'& .MuiListItemIcon-root': { paddingLeft: 15 },
		},
		userAvatar: {
			width: 80,
			height: 80,
			border: '2px solid white',
			marginLeft: 10,
		},
		link: {
			textDecoration: 'none',
			display: 'inline-block',
			outline: 'none',
		},
		activeSidebarItem: {
			backgroundColor: '#2F96E6',
			color: '#fff',
			'& p, & .MuiSvgIcon-root': {
				color: '#fff',
			},
			'&:hover': {
				'& p, & .MuiSvgIcon-root': {
					color: theme.palette.primary.main,
				},
			},
		},
		topBgImgOverlay: {
			position: 'absolute',
			left: 0,
			top: 0,
			width: '100%',
			height: '100%',
			backgroundColor: theme.palette.primary.main,
			opacity: 0.6,
		},
		topBg: {
			backgroundSize: 'cover',
			backgroundColor: theme.palette.primary.main,
			backgroundPosition: 'center',
			backgroundRepeat: 'no-repeat',
			minHeight: '30vh',
			minWidth: '50vw',
			padding: '15px',
			marginBottom: 0,
			position: 'relative',
		},
		closeBtn: {
			position: 'absolute',
			top: 10,
			right: 15,
			zIndex: 1,
			color: '#fff',
		},
		icon: {
			color: theme.palette.primary.main,
		},
		iconRed: {
			color: '#ee0000',
		},
		headerUserTitle: {
			fontSize: 14,
			color: theme.palette.primary.main,
			fontWeight: 500,
			textTransform: 'uppercase',
			marginBottom: 0,
			marginLeft: 13,
			marginTop: 5,
			[theme.breakpoints.only('lg')]: {
				fontSize: 12,
			},
		},
		headerHoursTitle: {
			fontSize: 14,
			color: theme.palette.primary.main,
			fontWeight: 500,
			textTransform: 'uppercase',
			marginBottom: 0,
			marginLeft: 13,
			marginTop: 5,
			[theme.breakpoints.only('lg')]: {
				fontSize: 12,
			},
			[theme.breakpoints.down('lg')]: {
				marginLeft: 0,
			},
		},
		headerHoursText: {
			marginBottom: 0,
			marginTop: 3,
			paddingLeft: 15,
			lineHeight: '38px',
			minWidth: 235,
			fontSize: 15,
			[theme.breakpoints.only('lg')]: {
				fontSize: 12,
			},
		},
		headerTypoText: {
			marginBottom: 0,
			marginTop: 15,
			paddingLeft: 15,
			lineHeight: '38px',
			minWidth: 235,
			fontSize: 15,
			[theme.breakpoints.only('lg')]: {
				fontSize: 12,
			},
		},
		selectFilters: {
			margin: 0,
			padding: 0,
			'& .MuiSvgIcon-root': {
				color: '#fff',
			},
			'& .MuiSelect-select.MuiSelect-select p': {
				color: '#fff',
			},
			'&:before, &:after': {
				display: 'none',
			},
			'& > div': {
				border: 'none',
			},
			'& div div ': {
				border: 'none',
				fontSize: 15,
				textAlign: 'left',
				color: '#2F96E6',
				background: '#fff !important',
				padding: 0,
				minWidth: '110px',
				width: '95%',
			},
		},
		selectDisable: {
			'&:focus': {
				background: 'transparent',
			},
			'&:hover': {
				background: 'rgba(0, 0, 0, 0.12)',
			},
		},
		bookBtn: {
			width: '90%',
			marginLeft: '5%',
			borderRadius: 5,
			padding: '15px 0',
			marginTop: 15,
			position: 'absolute',
			left: 0,
			bottom: 10,
		},
		headerUserText: {
			fontWeight: 500,
			marginBottom: 0,
			fontSize: 12,
			color: '#333',
		},
		autoCompleteWrap: {
			paddingTop: 0,
			'& .MuiAutocomplete-root': {
				width: '100%',
				paddingLeft: 15,
			},
			'& .MuiInputLabel-root': {
				color: theme.palette.primary.main,
			},
		},
		username: {
			color: '#fff',
			fontSize: 20,
			marginTop: 15,
			position: 'relative',
			zIndex: 1,
		},
		selectHoursType: {
			'& .MuiSvgIcon-root': {
				top: -5,
				right: -5,
				color: theme.palette.primary.main,
			},
			'&:before, &:after': {
				display: 'none',
			},
			'& .MuiSelect-select.MuiSelect-select': {
				fontSize: 14,
				color: theme.palette.primary.main,
				fontWeight: 500,
				textTransform: 'uppercase',
				marginBottom: 0,
				marginLeft: 0,
				marginTop: 0,
				paddingTop: 0,
				[theme.breakpoints.only('lg')]: {
					fontSize: 12,
				},
			},
		},
	})
);

export default function MobileMenuComponent({
	mobileMenuOpen,
	handleMobileMenuClose,
	handleMobileMenuOpen,
}: {
	mobileMenuOpen: boolean;
	handleMobileMenuClose: () => any;
	handleMobileMenuOpen: () => any;
}) {
	const classes = useStyles({});

	const { pathname } = useLocation();
	const navigate = useNavigate();
	const { showSnackBar } = useContext(SnackBarContext);
	const { isSuperAdmin, isBrandAdmin, authBody, logOut, currentBrand, userOptions, setUserOptions, userCheckins } = useContext(AuthContext);

	const [activeSubscription, setActiveSubscription] = useState<SubscriptionInterface | undefined>();

	const [activeCreditHoursType, setActiveCreditHoursType] = useState<HoursType | undefined>(userOptions?.creditHoursType);

	const [subscriptions, setSubscriptions] = useState<SubscriptionInterface[]>([]);

	let signUpLink = '/sign/?redirect=/membership/366?simpleMembership=true&isFromMembership=366';
	if (APP_DOMAIN === 'beta.drop-desk.com') signUpLink = '/sign/?redirect=/membership/547?simpleMembership=true&isFromMembership=547';
	if (APP_DOMAIN === 'dev.drop-desk.com') signUpLink = '/sign/?redirect=/membership/270?simpleMembership=true&isFromMembership=270';

	let isFromMembership = false;
	if (window.location) {
		const searchParams = parseQueryHelper(window.location.search);
		isFromMembership = typeof searchParams.isFromMembership !== 'undefined';
	}

	const notAllowed = () => {
		showSnackBar('Please create your membership before continuing');
	};

	useEffect(() => {
		if (authBody && authBody.subscriptions) {
			const subs = authBody.subscriptions.filter((s: SubscriptionInterface) => s.isOngoing);
			if (subs.length > 0) {
				const savedSub = subs.find((s: SubscriptionInterface) => s.id === userOptions?.subscriptionId);
				setSubscriptions(subs);
				setActiveSubscription(typeof savedSub !== 'undefined' ? savedSub : subs[0]);
			}
		}
	}, [authBody]);

	const handleHoursTypeChange = (event: SelectChangeEvent) => {
		setActiveCreditHoursType(event.target.value as HoursType);
		setUserOptions({ ...userOptions, creditHoursType: event.target.value as HoursType });
	};

	const handleSubscriptionChange = (event: SelectChangeEvent) => {
		const sub = subscriptions.find((s) => Number(s.id) === Number(event.target.value));
		setActiveSubscription(sub);
		setUserOptions({ ...userOptions, subscriptionId: Number(event.target.value) });
	};

	const subsDropDown = () => {
		if (!authBody || !subscriptions.length) return <></>;

		return (
			<FormControl fullWidth style={{ margin: 0, position: 'relative', zIndex: 1 }} variant="standard">
				<Select
					labelId="select-sub"
					onChange={handleSubscriptionChange}
					className={classes.selectFilters}
					value={activeSubscription ? String(activeSubscription.id) : ''}
					IconComponent={ExpandMoreIcon}
				>
					{!subscriptions.length && (
						<MenuItem style={{ border: 'none' }} value="" key={0} disabled classes={{ selected: classes.selectDisable }}>
							<Typography className={classes.headerUserText} style={{ whiteSpace: 'normal' }}>
								No subscriptions
							</Typography>
						</MenuItem>
					)}

					{subscriptions.map((item: SubscriptionInterface, i) => (
						<MenuItem classes={{ selected: classes.selectDisable }} value={item.id} key={i + 1}>
							<Typography className={classes.headerUserText} style={{ whiteSpace: 'normal' }}>
								{item.name}
							</Typography>
						</MenuItem>
					))}
				</Select>
			</FormControl>
		);
	};

	const renderUserConfHours = () => {
		if (!authBody || !subscriptions.length) return '';

		return (
			<FormControl fullWidth style={{ margin: 0 }} variant="standard">
				<InputLabel shrink className={classes.headerUserTitle}>
					<Select value={activeCreditHoursType} onChange={handleHoursTypeChange} displayEmpty className={classes.selectHoursType}>
						<MenuItem value="" disabled>
							Credits
						</MenuItem>
						<MenuItem value="conference">Conference Credits</MenuItem>
						<MenuItem value="check-in">DropDesk Pass Credits</MenuItem>
					</Select>
				</InputLabel>
				<Typography className={classes.headerTypoText}>
					<CreditHoursStringComponent isMobile subscription={activeSubscription} hoursType={activeCreditHoursType} />
				</Typography>
			</FormControl>
		);
	};

	const renderExternal = (item: MenuItemInterface, i: number) => {
		if (checkPermsHelper(item.customerPermissions, item.adminPermissions, authBody))
			return (
				<a key={i} href={item.url} className={classes.link} target="_blank" rel="noopener noreferrer">
					<ListItem component="div" button>
						<ListItemIcon>
							<item.icon className={classes.icon} />
						</ListItemIcon>
						<Typography>{item.name}</Typography>
					</ListItem>
				</a>
			);
	};

	const renderInternal = (item: MenuItemInterface, i: number) => {
		if (checkPermsHelper(item.customerPermissions, item.adminPermissions, authBody)) {
			const htmlInner = (
				<>
					<ListItemIcon>
						<item.icon className={classes.icon} />
					</ListItemIcon>
					<Typography>{item.name}</Typography>
				</>
			);

			if (!isFromMembership)
				return (
					<ListItem
						key={i}
						component={Link}
						to={item.url}
						className={classNames(pathname === item.url && classes.activeSidebarItem)}
						button
					>
						{htmlInner}
					</ListItem>
				);

			return (
				<ListItem
					component="div"
					key={i}
					className={classNames(pathname === item.url && classes.activeSidebarItem)}
					button
					onClick={notAllowed}
				>
					{htmlInner}
				</ListItem>
			);
		}
	};

	const renderMenuItem = (item: MenuItemInterface, i: number) => {
		if (item.url === '/checkout') {
			return (
				<ListItem key={i} component={Link} to={item.url} className={classNames(pathname === item.url && classes.activeSidebarItem)} button>
					<ListItemIcon>
						<item.icon className={userCheckins.length ? classes.iconRed : classes.icon} />
					</ListItemIcon>
					<Typography>{item.name}</Typography>
				</ListItem>
			);
		}
		if (item.external) return renderExternal(item, i);
		return renderInternal(item, i);
	};

	const doLogOut = () => {
		logOut();
		navigate({ pathname: '/locations' });
	};

	return (
		<SwipeableDrawer open={mobileMenuOpen} onClose={handleMobileMenuClose} onOpen={handleMobileMenuOpen} className={classes.root}>
			<IconButton onClick={handleMobileMenuClose} className={classes.closeBtn} size="large">
				<MenuIcon />
			</IconButton>

			<Grid
				container
				className={classes.topBg}
				alignContent="flex-end"
				alignItems="flex-start"
				spacing={3}
				style={{
					backgroundImage: `url(${
						(currentBrand && currentBrand.background && `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${currentBrand.background.url}`) ||
						'/images/bg-signin.png'
					})`,
				}}
			>
				<div className={classes.topBgImgOverlay} />
				{authBody && authBody.id && (
					<>
						<Grid item xs={5}>
							<AvatarComponent
								size="lg"
								className={classes.userAvatar}
								url={`/profile/${authBody.id}`}
								src={authBody.photo ? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${authBody.photo.url}` : undefined}
								altText={`${authBody.firstname} ${authBody.lastname}`}
							/>
						</Grid>
						<Grid item xs={7} className={classes.username}>
							<span className={classes.username}>
								{authBody.firstname} {authBody.lastname}
							</span>
							{subsDropDown()}
						</Grid>
					</>
				)}
			</Grid>

			<List>
				{!authBody && (
					<>
						<ListItem component={Link} to="/locations" button>
							<ListItemIcon>
								<RoomIcon className={classes.icon} />
							</ListItemIcon>
							<Typography>Find space</Typography>
						</ListItem>

						<a href="https://drop-desk.com/pass" className={classes.link} target="_blank" rel="noopener noreferrer">
							<ListItem component="div" button>
								<ListItemIcon>
									<CardTravelIcon className={classes.icon} />
								</ListItemIcon>
								<Typography>Dropdesk Pass</Typography>
							</ListItem>
						</a>

						<Divider />

						<ListItem component={Link} to="/sign" button>
							<ListItemIcon>
								<LockOpenIcon className={classes.icon} />
							</ListItemIcon>
							<Typography>Login</Typography>
						</ListItem>
						<Divider />

						<ListItem component={Link} to={signUpLink} button>
							<ListItemIcon>
								<LockOpenIcon className={classes.icon} />
							</ListItemIcon>
							<Typography>Sign Up For Free</Typography>
						</ListItem>
					</>
				)}
				{authBody && !isSuperAdmin && !isBrandAdmin && (
					<>
						{subscriptions.length > 0 && (
							<>
								<ListItem style={{ paddingTop: 0 }}>{renderUserConfHours()}</ListItem>
							</>
						)}
					</>
				)}

				{authBody && !isSuperAdmin && !isBrandAdmin && menuItems.map(renderMenuItem)}
				{authBody && (isSuperAdmin || isBrandAdmin) && adminMenuItems.map(renderMenuItem)}

				<Divider />

				{profileMenuItems(authBody, isFromMembership).map(renderMenuItem)}

				<Divider />

				{authBody && (
					<>
						<Divider />
						<ListItem button onClick={() => doLogOut()}>
							<ListItemIcon className={classes.icon}>
								<ExitToAppIcon />
							</ListItemIcon>
							<ListItemText primary="Log out" />
						</ListItem>
					</>
				)}
			</List>
		</SwipeableDrawer>
	);
}
