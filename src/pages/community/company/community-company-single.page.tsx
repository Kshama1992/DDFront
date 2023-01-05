import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import CompanyService from '@service/company.service';
import { SnackBarContext } from '@context/snack-bar.context';
import checkPermsHelper from '@helpers/checkPerms.helper';
import { AuthContext } from '@context/auth.context';
import CompanyInterface from 'dd-common-blocks/dist/interface/company.interface';
import { Theme } from '@mui/material/styles';
import BreadcrumbsComponent from '../../../components/breadcrumbs.component';
import BasePage from '../../base.page';
import CommunityCompanyInfoComponent from './community-company-info.component';
import GroupCompanyCreateComponent from '../group-company-create.component';
import { CommunitySidebarSingleItemComponent } from '../community-sidebar.component';
import { defaultCommunityRedirect } from '../../../components/mainMenu/main-menu.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		rootMobile: {
			width: '100%',
			height: '100%',
			margin: 0,
		},
		root: {
			width: 'calc(100% - 90px)',
			height: '100%',
			margin: 0,
			marginLeft: 90,
		},
		profileTop: {
			height: '50px',
			paddingLeft: '30px !important',
			background: '#dddee0',
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
		topTitle: {
			padding: 25,
			boxShadow: '0px 2px 2px 0px grey',
		},
		backContainer: {
			padding: 20,
			backgroundColor: '#dadada',
			boxSizing: 'border-box',
		},
		backIcon: {},
		backLink: {},
	})
);

export default function CommunityCompanySinglePage() {
	const theme = useTheme();
	const classes = useStyles({});
	const { id } = useParams();
	const { authBody } = useContext(AuthContext);
	const navigate = useNavigate();

	const companyService = new CompanyService();
	const { showSnackBar } = useContext(SnackBarContext);

	const [company, setCompany] = useState<CompanyInterface | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;

	if (!checkPermsHelper(['Enable Company Tab'], ['Community Companies'], authBody)) navigate(defaultCommunityRedirect(authBody));

	const loadSingle = useCallback(async () => {
		try {
			const loadedCompany = await companyService.single(id);
			setCompany(loadedCompany);
		} catch (e) {
			console.error(e);
			showSnackBar((e as Error).message);
			navigate(-1);
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	useEffect(() => {
		loadSingle().then();
	}, [id]);

	return (
		<BasePage>
			<Helmet>
				<title>Community: {`Companies - ${company ? company.name : 'Company'}`}</title>
				<meta name="description" content={`Community: Companies - ${company ? company.name : 'Company'}`} />
			</Helmet>

			<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
				<Grid item xs={12} sm={3} className={classes.leftSide}>
					<CommunitySidebarSingleItemComponent activeType="companies" />
				</Grid>

				<Grid item xs={12} sm={9} className={classes.rightSide}>
					<Grid container spacing={3}>
						<Grid item sm={12} xs={12} style={{ position: 'relative' }}>
							<BreadcrumbsComponent primary="Community:" secondary={`Companies - ${company ? company.name : 'Company'}`} />
							<GroupCompanyCreateComponent type="company" />
						</Grid>
						<Grid item sm={12} xs={12}>
							<Paper>
								<Grid container spacing={0}>
									<Grid item xs={12} className={classes.topTitle}>
										<Typography component="h2" variant="body2">
											{company ? company.name : 'Companies'}
										</Typography>
									</Grid>
									<Grid item xs={12} className={classes.backContainer}>
										<Typography
											className={classes.backLink}
											component={Button}
											onClick={() => navigate(-1)}
											startIcon={<ChevronLeftIcon className={classes.backIcon} />}
										>
											Back to companies list
										</Typography>
									</Grid>
								</Grid>

								{isLoading && <LinearProgress />}
								{company && (
									<CommunityCompanyInfoComponent
										data={company}
										onSaved={(savedCompany: CompanyInterface) => setCompany(savedCompany)}
									/>
								)}
							</Paper>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</BasePage>
	);
}
