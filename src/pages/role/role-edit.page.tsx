import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Theme, useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Helmet } from 'react-helmet';
import BrandRoleInterface from 'dd-common-blocks/dist/interface/brand-role.interface';
import FormRoleComponent from '@forms/form-role.component';
import RoleService from '@service/role.service';
import BasePage from '../base.page';
import BreadcrumbsComponent from '../../components/breadcrumbs.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		rootMobile: {
			width: '100%',
			height: '100%',
			margin: 0,
		},
		root: {
			width: 'calc(100% - 90px)',
			// height: '100%',
			margin: 0,
			marginLeft: 90,
		},
		leftSide: {
			maxWidth: 350,
			position: 'fixed',
			width: 350,
			zIndex: 1,
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				width: '100%',
				position: 'relative',
				paddingRight: 24,
			},
		},
		rightSide: {
			marginLeft: 350,
			width: 'calc(100% - 350px)',
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				paddingRight: 24,
				marginLeft: 0,
			},
		},
		formWrapper: {
			padding: 25,
		},
	})
);

export default function RoleEditPage() {
	const theme = useTheme();
	const classes = useStyles({});

	const roleService = new RoleService();

	const { roleId } = useParams();

	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;

	const [loading, setLoading] = useState(roleId !== '0');
	const [roleData, setRoleData] = useState<BrandRoleInterface>();

	const loadRole = useCallback(async () => {
		const data = await roleService.single(roleId);
		setRoleData(data);
		setLoading(false);
	}, []);

	useEffect(() => {
		if (roleId !== '0') {
			loadRole().then();
		}
	}, []);

	return (
		<BasePage>
			<Helmet>
				<title>{`Role ${loading || !roleData ? ' create' : ` edit - ${roleData.name}`}`}</title>
				<meta name="description" content="Role" />
			</Helmet>

			<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
				<Grid item xs={12} md={9} xl={10} className={classes.rightSide}>
					<Grid container spacing={3}>
						<Grid item sm={12} xs={12} style={{ position: 'relative' }}>
							<BreadcrumbsComponent
								primary={`${roleId !== '0' ? 'Edit' : 'Add'} a role:`}
								secondary={roleId !== '0' && roleData ? roleData.name : ''}
							/>
						</Grid>
						<Grid item lg={10} md={12} xs={12}>
							{loading && <LinearProgress />}
							{!loading && <FormRoleComponent initialValues={roleData} />}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</BasePage>
	);
}
