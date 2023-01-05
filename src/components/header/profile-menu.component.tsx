import React, { useContext } from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Link, useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { parseQueryHelper } from '@helpers/parse-query.helper';
import { AuthContext } from '@context/auth.context';
import { MenuItemInterface, profileMenuItems } from '../mainMenu/main-menu.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		icon: {
			color: theme.palette.primary.main,
		},
	})
);

export default function ProfileMenuComponent({ profileOpen, handleProfileClose }: { profileOpen: boolean; handleProfileClose: () => void }) {
	const { authBody, logOut } = useContext(AuthContext);
	const classes = useStyles({});
	const navigate = useNavigate();

	const doLogOut = () => {
		logOut();
		navigate({ pathname: '/locations' });
	};

	let isFromMembership = false;
	if (window.location) {
		const searchParams = parseQueryHelper(window.location.search);
		isFromMembership = typeof searchParams.isFromMembership !== 'undefined';
	}

	const renderMenuItem = (item: MenuItemInterface, i: number) => (
		<ListItem key={i} button component={Link} to={item.url}>
			<ListItemIcon className={classes.icon}>
				<item.icon />
			</ListItemIcon>
			<ListItemText primary={item.name} />
		</ListItem>
	);

	return (
		<Drawer variant="persistent" anchor="right" open={profileOpen}>
			<div>
				<IconButton onClick={handleProfileClose} className={classes.icon} size="large">
					<ChevronRightIcon />
				</IconButton>
			</div>
			<Divider />
			<List>{profileMenuItems(authBody, isFromMembership).map(renderMenuItem)}</List>

			<Divider />
			<List>
				<ListItem button onClick={() => doLogOut()}>
					<ListItemIcon className={classes.icon}>
						<ExitToAppIcon />
					</ListItemIcon>
					<ListItemText primary="Log out" />
				</ListItem>
			</List>
		</Drawer>
	);
}
