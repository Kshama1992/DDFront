import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTheme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Theme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import UserFormValuesInterface from '@forms/interface/user-form-values.interface';
import FormMemberComponent from '@forms/form-member.component';
import { SnackBarContext } from '@context/snack-bar.context';
import checkPermsHelper from '@helpers/checkPerms.helper';
import { AuthContext } from '@context/auth.context';
import UserService from '@service/user.service';
import BreadcrumbsComponent from '../../../components/breadcrumbs.component';
import BasePage from '../../base.page';
import { CommunitySidebarSingleItemComponent } from '../community-sidebar.component';
import { defaultCommunityRedirect } from '../../../components/mainMenu/main-menu.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		rootMobile: {
			width: '100%',
			height: '100%',
			margin: 0,
			'& .react-tel-input .form-control': {
				borderRadius: 3,
			},
			'& .react-tel-input .flag-dropdown:before': {
				display: 'none !important',
			},
		},
		root: {
			width: 'calc(100% - 90px)',
			height: '100%',
			margin: 0,
			marginLeft: 90,
			'& .react-tel-input .form-control': {
				borderRadius: 3,
			},
			'& .react-tel-input .flag-dropdown:before': {
				display: 'none !important',
			},
		},
		leftSide: {
			maxWidth: 300,
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				width: '100%',
				paddingRight: 24,
			},
		},
		rightSide: {
			width: 'calc(100% - 300px)',
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				width: '100%',
				paddingRight: 24,
			},
		},
	})
);

export default function CommunityMemberSinglePage() {
	const theme = useTheme();
	const classes = useStyles({});
	const userService = new UserService();

	const { id } = useParams();
	const navigate = useNavigate();
	const { showSnackBar } = useContext(SnackBarContext);
	const { authBody } = useContext(AuthContext);

	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;

	const [user, setUser] = useState<UserInterface | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(id !== '0');

	if (!checkPermsHelper(['Enable Member Tab'], ['Community Members'], authBody)) navigate(defaultCommunityRedirect(authBody));

	const loadUser = useCallback(async () => {
		setIsLoading(true);

		try {
			if (id !== '0') {
				const userData = await userService.single(id);
				setUser(userData);
			}
		} catch (e) {
			showSnackBar((e as Error).message);
			navigate('/community/members');
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	useEffect(() => {
		loadUser().then();
	}, []);

	// @ts-ignore
	return (
		<BasePage>
			<Helmet>
				<title>Community: {`Members - ${user ? `${user.firstname} ${user.lastname}` : 'Member'}`}</title>
				<meta name="description" content={`Community: Members - ${user ? `${user.firstname} ${user.lastname}` : 'Member'}`} />
			</Helmet>

			<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
				<Grid item xs={12} sm={3} className={classes.leftSide}>
					<CommunitySidebarSingleItemComponent activeType="members" />
				</Grid>

				<Grid item xs={12} sm={9} className={classes.rightSide}>
					<Grid container spacing={3}>
						<Grid item sm={12} xs={12}>
							<BreadcrumbsComponent
								primary="Community:"
								secondary={`Members - ${user ? `${user.firstname} ${user.lastname}` : 'Member'}`}
							/>
						</Grid>
						<Grid item sm={12} xs={12}>
							<Paper>
								{isLoading && <LinearProgress />}

								{!isLoading && <FormMemberComponent initialValues={user as UserFormValuesInterface} doRefresh={() => navigate(0)} />}
							</Paper>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</BasePage>
	);
}
