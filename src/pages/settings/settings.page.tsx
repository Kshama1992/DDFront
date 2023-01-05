import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';

import Switch from '@mui/material/Switch';
import makeStyles from '@mui/styles/makeStyles';
import { siteTitleHelper } from '@helpers/site-title.helper';
import { siteDescriptionHelper } from '@helpers/site-description.helper';
import { AuthContext } from '@context/auth.context';
import { Theme } from '@mui/material/styles';
import checkPermsHelper from '@helpers/checkPerms.helper';
import BreadcrumbsComponent from '../../components/breadcrumbs.component';
import BasePage from '../base.page';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		rootMobile: {
			width: '100%',
			height: 'calc(100% - 70px)',
			margin: 0,
			background: '#efefef',
			'& .react-tel-input .form-control': {
				borderRadius: 3,
				// padding: '17px 14px 17px 58px'
			},
			'& .react-tel-input .flag-dropdown:before': {
				display: 'none !important',
			},
		},
		root: {
			width: 'calc(100% - 90px)',
			height: 'calc(100% - 70px)',
			margin: 0,
			marginLeft: 90,
			background: '#efefef',
			'& .react-tel-input .form-control': {
				borderRadius: 3,
			},
			'& .react-tel-input .flag-dropdown:before': {
				display: 'none !important',
			},
		},
		top: {
			height: '50px',
			paddingLeft: '30px !important',
			background: '#dddee0',
		},
		gridWrap: {
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				width: '100%',
				paddingRight: 24,
			},
		},
		inner: {
			position: 'relative',
			minHeight: 400,
			// padding: '30px 60px 40px',
		},
	})
);

export default function SettingsPage() {
	const theme = useTheme();
	const classes = useStyles({});
	const { authBody, logOut, isSuperAdmin, isBrandAdmin } = useContext(AuthContext);

	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;
	const navigate = useNavigate();

	return (
		<BasePage>
			<Helmet>
				<title>{siteTitleHelper('Settings')}</title>
				<meta name="description" content={siteDescriptionHelper('Settings')} />
			</Helmet>

			<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
				<Grid item xs={12} className={classes.top}>
					<BreadcrumbsComponent primary="Account:" secondary="Settings" />
				</Grid>
				<Grid item md={6} xl={6} xs={12} className={classes.gridWrap}>
					<Paper className={classes.inner}>
						<List component="nav" aria-label="contacts">
							{authBody && checkPermsHelper(['Customer Profile'], ['Admin Profile'], authBody) && (
								<>
									<ListItem
										button
										onClick={() => navigate(`${isBrandAdmin || isSuperAdmin ? '/dashboard' : ''}/profile/${authBody.id}`)}
									>
										<ListItemIcon>
											<Avatar src={authBody.photo ? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${authBody.photo.url}` : ''}>
												H
											</Avatar>
										</ListItemIcon>
										<ListItemText primary="Edit profile" />
									</ListItem>
									<Divider />
								</>
							)}

							<ListItem button>
								<ListItemText id="switch-list-label-wifi" inset primary="Notifications" />
								<ListItemSecondaryAction>
									<Switch
										edge="end"
										onChange={() => console.error('!!!')}
										inputProps={{ 'aria-labelledby': 'switch-list-label-notification' }}
									/>
								</ListItemSecondaryAction>
							</ListItem>
							<Divider />

							<ListItem button>
								<ListItemText inset primary="Terms of Service" />
							</ListItem>
							<Divider />

							<ListItem button>
								<ListItemText inset primary="Privacy Policy" />
							</ListItem>
							<Divider />

							<ListItem button disabled>
								<ListItemText inset primary="FAQ" />
							</ListItem>
							<Divider />

							<ListItem button onClick={() => logOut()}>
								<ListItemText inset primary="Logout" />
							</ListItem>
							<Divider />
						</List>
					</Paper>
				</Grid>
			</Grid>
		</BasePage>
	);
}
