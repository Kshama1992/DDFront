import React, { useContext } from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import RoomIcon from '@mui/icons-material/Room';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DashboardIcon from '@mui/icons-material/Dashboard';
// import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChatIcon from '@mui/icons-material/Chat';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import TimelineIcon from '@mui/icons-material/Timeline';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FeedbackIcon from '@mui/icons-material/Feedback';
import GroupIcon from '@mui/icons-material/Group';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Tooltip from '@mui/material/Tooltip';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import { isCardsExpired } from 'dd-common-blocks/dist/user';
import { SnackBarContext } from '@context/snack-bar.context';
import { parseQueryHelper } from '@helpers/parse-query.helper';
import { DEFAULT_BRAND_NAME, SUPPORT_EMAIL } from '@core/config';
import { AuthContext, isAdmin } from '@context/auth.context';
import checkPermsHelper from '@helpers/checkPerms.helper';
import isSubscriptionsExpired from '@helpers/user/is-subscriptions-expired.helper';
import { isSuperAdmin, isVenueAdmin } from '@helpers/user/is-admin.helper';
import { Theme } from '@mui/material/styles';
import { ListItemButton } from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		sidebarUser: {
			display: 'flex',
			direction: 'rtl',
			top: 70,
			left: 0,
			width: 90,
			height: 'calc(100vh - 70px)',
			position: 'fixed',
			zIndex: 99,
			overflowY: 'auto',
			paddingRight: 16,
			background: 'transparent',
			'&::-webkit-scrollbar': {
				background: '#3698e3',
				borderRadius: 0,
				width: 0,
				right: 5,
				top: 0,
				position: 'absolute',
			},
			'&::-webkit-scrollbar-thumb': {
				borderRadius: 0,
				background: '#dfdfdf',
			},
			'&:hover': {
				'&::-webkit-scrollbar': {
					width: 5,
				},
			},
		},

		sideBarList: {
			padding: 0,
			position: 'relative',
			minHeight: 580,
			width: '100%',
			height: '100%',
			background: '#3698e3',
			'& ul': {
				height: '100%',
				'&:first-child': {
					paddingTop: 20,
				},
			},
		},

		link: {
			textDecoration: 'none',
			outline: 'none',
		},
		listItem: {
			justifyContent: 'center',
			color: '#fff',
			padding: '20px 0',
			flexDirection: 'column',
			'&:hover': {
				background: '#187ecc',
				'& >p': {
					opacity: 1,
					color: '#fff !important',
				},
				'& >span': {
					color: '#fff',
				},
			},
		},
		listItemDisabled: {
			opacity: 0.5,
			cursor: 'default',
			justifyContent: 'center',
			color: '#fff',
			padding: '20px 0',
			flexDirection: 'column',
			'&:hover': {
				background: '#187ecc',
				'& >p': {
					opacity: 1,
					color: '#fff !important',
				},
				'& >span': {
					color: '#fff',
				},
			},
		},
		menuIcon: {
			color: '#a1c7fa',
			fontSize: 30,
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		menuIconRed: {
			color: '#ee0000',
			fontSize: 30,
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		inviteIcon: {
			transform: 'scaleX(-1)',
		},
		menuText: {
			textAlign: 'center',
			color: '#fff',
			opacity: 0,
			paddingTop: 5,
			marginBottom: 0,
			fontWeight: 500,
			fontSize: 12,
		},
		activeSidebarItem: {
			background: '#187ecc',
			'& >span': {
				color: '#fff',
			},
			'&:after': {
				position: 'absolute',
				content: '""',
				top: '34%',
				right: '-24px',
				border: '14px solid transparent',
				borderLeft: '11px solid #187ecc',
			},
		},
	})
);

export interface MenuItemInterface {
	name: string;
	url: string;
	external: boolean;
	icon: any;
	customerPermissions: string[];
	adminPermissions: string[];
}

export const menuItems: MenuItemInterface[] = [
	{
		name: 'Find a Space',
		url: '/locations',
		external: false,
		icon: RoomIcon,
		customerPermissions: ['Customer Spaces'],
		adminPermissions: [],
	},
	// {
	// 	name: 'DropIn',
	// 	url: '/checkout',
	// 	external: false,
	// 	icon: AlarmOnIcon,
	// 	customerPermissions: [],
	// 	adminPermissions: [],
	// },
	{
		name: 'Add Payment',
		url: '/payment/methods',
		external: false,
		icon: CreditCardIcon,
		customerPermissions: ['Customer Billings'],
		adminPermissions: [],
	},
	{
		name: 'History',
		url: '/history/past',
		external: false,
		icon: AccessTimeIcon,
		customerPermissions: ['Customer Activity'],
		adminPermissions: [],
	},
	{
		name: 'Community',
		url: '/community/members',
		external: false,
		icon: GroupIcon,
		adminPermissions: [],
		customerPermissions: ['Customer Community'],
	},
	{
		name: 'Help',
		url: `mailto:${SUPPORT_EMAIL}`,
		external: true,
		icon: HelpOutlineIcon,
		customerPermissions: [],
		adminPermissions: [],
	},
	{
		name: 'Settings',
		url: '/settings',
		external: false,
		icon: SettingsIcon,
		customerPermissions: [],
		adminPermissions: [],
	},
];

export const adminMenuItems: MenuItemInterface[] = [
	{
		name: 'Activity',
		url: '/dashboard/activity',
		external: false,
		icon: EventNoteIcon,
		adminPermissions: ['Calender'],
		customerPermissions: [],
	},
	{
		name: 'Spaces',
		url: '/dashboard/venue/0',
		external: false,
		icon: DashboardIcon,
		adminPermissions: ['Venues'],
		customerPermissions: [],
	},
	{
		name: 'Community',
		url: '/dashboard/community/members',
		external: false,
		icon: GroupIcon,
		adminPermissions: ['Community Members', 'Community Companies', 'Community Groups', 'Feeds'],
		customerPermissions: [],
	},
	{
		name: 'Feed',
		url: '/dashboard/community/feeds',
		external: false,
		icon: ChatIcon,
		adminPermissions: ['Feeds'],
		customerPermissions: [],
	},
	{
		name: 'Reports',
		url: '/dashboard/reports',
		external: false,
		icon: TimelineIcon,
		adminPermissions: ['Reports'],
		customerPermissions: [],
	},
	{
		name: 'Help',
		url: '/dashboard/helpdesk',
		external: true,
		icon: FeedbackIcon,
		adminPermissions: ['Helpdesk'],
		customerPermissions: [],
	},
	{
		name: 'Settings',
		url: '/dashboard/settings',
		external: false,
		icon: FormatListBulletedIcon,
		adminPermissions: [],
		customerPermissions: [],
	},
];

export const profileMenuItems = (authBody: UserInterface | undefined, isFromMembership = false): MenuItemInterface[] => {
	if (!authBody) return [];

	const returnMenu: MenuItemInterface[] = [];

	if (!isFromMembership) {
		returnMenu.push({
			name: 'Profile',
			url: `${isAdmin(authBody) ? '/dashboard' : ''}/profile/${authBody.id}`,
			external: false,
			icon: PersonIcon,
			customerPermissions: ['Customer Profile'],
			adminPermissions: ['Admin Profile'],
		});

		if ((authBody?.leadingTeams && authBody?.leadingTeams.length > 0) || (authBody?.teamMembership && authBody?.teamMembership.length > 0))
			returnMenu.push({
				name: 'My team',
				url: `${isAdmin(authBody) ? '/dashboard' : ''}/team`,
				external: false,
				icon: GroupIcon,
				customerPermissions: [],
				adminPermissions: [],
			});
	}

	if (isAdmin(authBody))
		returnMenu.push({
			name: 'Email templates',
			url: '/dashboard/email-templates',
			external: false,
			icon: EmailIcon,
			customerPermissions: [],
			adminPermissions: ['Mail Messages'],
		});

	if (isSuperAdmin(authBody))
		returnMenu.push({
			name: 'Brands',
			url: '/dashboard/brand',
			external: false,
			icon: BusinessCenterIcon,
			customerPermissions: [],
			adminPermissions: [],
		});

	if (isAdmin(authBody))
		returnMenu.push({
			name: 'Roles',
			url: '/dashboard/role',
			external: false,
			icon: PermContactCalendarIcon,
			customerPermissions: [],
			adminPermissions: ['Permissions'],
		});

	if (isSuperAdmin(authBody))
		returnMenu.push({
			name: 'Teams',
			url: '/dashboard/team-admin',
			external: false,
			icon: GroupWorkIcon,
			customerPermissions: [],
			adminPermissions: [],
		});

	return returnMenu;
};

export const getFirstMenuItem = (authBody: UserInterface | undefined): MenuItemInterface => {
	if (!authBody)
		return {
			name: 'Find a Space',
			url: '/locations',
			external: false,
			icon: RoomIcon,
			customerPermissions: [],
			adminPermissions: [],
		};
	const arr = isAdmin(authBody) ? adminMenuItems : menuItems;
	return arr.filter((i: MenuItemInterface) => checkPermsHelper(i.customerPermissions, i.adminPermissions, authBody))[0];
};

// ['Customer Community'], ['Community Members', 'Community Companies', 'Community Groups', 'Feeds']
// ['Enable Member Tab'], ['Community Members']
// ['Enable Group Tab'], ['Community Groups']
// ['Customer Feeds'], ['Feeds']
// ['Enable Company Tab'], ['Community Companies']
export const defaultCommunityRedirect = (authBody: UserInterface | undefined): string => {
	const defaultUrl = '/locations';
	if (!authBody || !checkPermsHelper(['Customer Community'], ['Community Members', 'Community Companies', 'Community Groups', 'Feeds'], authBody))
		return defaultUrl;
	if (checkPermsHelper(['Enable Member Tab'], ['Community Members'], authBody)) return `${isAdmin(authBody) ? '/dashboard' : ''}/community/members`;
	if (checkPermsHelper(['Enable Group Tab'], ['Community Groups'], authBody)) return `${isAdmin(authBody) ? '/dashboard' : ''}/community/groups`;
	if (checkPermsHelper(['Enable Company Tab'], ['Community Companies'], authBody))
		return `${isAdmin(authBody) ? '/dashboard' : ''}/community/companies`;
	if (checkPermsHelper(['Customer Feeds'], ['Feeds'], authBody)) return `${isAdmin(authBody) ? '/dashboard' : ''}/community/feeds`;
	return defaultUrl;
};

function MainMenuComponent() {
	const classes = useStyles({});
	const { pathname } = useLocation();
	const { isBrandAdmin, isTeamMember, authBody, userCheckins } = useContext(AuthContext);

	const { showSnackBar } = useContext(SnackBarContext);

	const notAllowed = () => {
		showSnackBar('Please create your membership before continuing');
	};

	let isFromMembership = false;
	if (window.location) {
		const searchParams = parseQueryHelper(window.location.search);
		isFromMembership = typeof searchParams.isFromMembership !== 'undefined';
	}

	const renderExternal = (item: MenuItemInterface, i: number) => {
		if (checkPermsHelper(item.customerPermissions, item.adminPermissions, authBody))
			return (
				<a key={i} href={item.url} className={classes.link}>
					<ListItemButton component="div" className={classes.listItem}>
						<item.icon className={classes.menuIcon} />
						<Typography className={classes.menuText}>{item.name}</Typography>
					</ListItemButton>
				</a>
			);
	};

	const renderInternal = (item: MenuItemInterface, i: number) => {
		if (checkPermsHelper(item.customerPermissions, item.adminPermissions, authBody)) {
			const htmlInner = (
				<>
					<item.icon className={classes.menuIcon} />
					<Typography className={classes.menuText}>{item.name}</Typography>
				</>
			);

			if (!isFromMembership) {
				const isDDUser = authBody?.brand?.name === DEFAULT_BRAND_NAME;

				if (
					authBody &&
					!isDDUser &&
					!(authBody.teamMembership && authBody.teamMembership.length) &&
					!isSuperAdmin(authBody) &&
					!isVenueAdmin(authBody) &&
					!isBrandAdmin &&
					(isCardsExpired(authBody) || isSubscriptionsExpired(authBody)) &&
					['Community', 'Feed'].includes(item.name)
				) {
					let message = '';
					if (isCardsExpired(authBody))
						message = authBody?.cards && authBody?.cards.length === 0 ? 'Please add credit card' : 'Your credit card is expired';
					else message = authBody?.subscriptions?.length === 0 ? 'You have no subscriptions' : 'Your subscription is expired';

					return (
						<Tooltip title={message} placement="right" key={i}>
							<ListItemButton key={i} className={classes.listItemDisabled}>
								{htmlInner}
							</ListItemButton>
						</Tooltip>
					);
				}

				return (
					<ListItemButton
						key={i}
						component={Link}
						to={item.url}
						disabled={!checkPermsHelper(item.customerPermissions, item.adminPermissions, authBody)}
						className={classNames(classes.listItem, pathname === item.url && classes.activeSidebarItem)}
					>
						{htmlInner}
					</ListItemButton>
				);
			}

			return (
				<ListItemButton
					key={i}
					disabled={!checkPermsHelper(item.customerPermissions, item.adminPermissions, authBody)}
					className={classNames(classes.listItem, pathname === item.url && classes.activeSidebarItem)}
					onClick={notAllowed}
				>
					{htmlInner}
				</ListItemButton>
			);
		}
	};

	const renderMenuItem = (item: MenuItemInterface, i: number) => {
		if (item.url === '/checkout') {
			return (
				<ListItemButton
					key={i}
					component={Link}
					to={item.url}
					disabled={!checkPermsHelper(item.customerPermissions, item.adminPermissions, authBody)}
					className={classNames(classes.listItem, pathname === item.url && classes.activeSidebarItem)}
				>
					<item.icon className={userCheckins.length ? classes.menuIconRed : classes.menuIcon} />
					<Typography className={classes.menuText}>{item.name}</Typography>
				</ListItemButton>
			);
		}
		if (item.external) return renderExternal(item, i);
		return renderInternal(item, i);
	};

	return (
		<section className={classes.sidebarUser}>
			<List component="nav" className={classes.sideBarList}>
				{!isSuperAdmin(authBody) &&
					!isBrandAdmin &&
					menuItems.filter((mi) => !(mi.url === '/payment/methods' && isTeamMember)).map(renderMenuItem)}
				{(isSuperAdmin(authBody) || isBrandAdmin) && adminMenuItems.map(renderMenuItem)}
			</List>
		</section>
	);
}

export default MainMenuComponent;
