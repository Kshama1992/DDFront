import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { parse as parseQueryString } from 'query-string';
import DeleteIcon from '@mui/icons-material/Delete';
import { Theme, useTheme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import CCInterface from 'dd-common-blocks/dist/interface/cc.interface';
import { siteTitleHelper } from '@helpers/site-title.helper';
import { siteDescriptionHelper } from '@helpers/site-description.helper';
import { AuthContext } from '@context/auth.context';
import { SnackBarContext } from '@context/snack-bar.context';
import UserService from '@service/user.service';
import checkPermsHelper from '@helpers/checkPerms.helper';
import BreadcrumbsComponent from '../../components/breadcrumbs.component';
import BasePage from '../base.page';
import AddCCComponent from './add-cc.component';
import { getFirstMenuItem } from '../../components/mainMenu/main-menu.component';
import CCAvatar from './cc-avatar.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		rootMobile: {
			width: '100%',
			height: 'calc(100% - 70px)',
			margin: 0,
			background: '#efefef',
			'& .react-tel-input .form-control': {
				borderRadius: 3,
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
		innerWrap: {
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				marginLeft: 0,
				paddingRight: 24,
			},
		},
		inner: {
			position: 'relative',
			minHeight: 400,
		},
		title: {
			padding: 25,
		},
		addBtnWrapper: {
			padding: 25,
		},
		tableCell: {
			[theme.breakpoints.down('md')]: {
				width: '100%',
				display: 'inline-block',
				border: 'none',
				textAlign: 'center',
				padding: '15px 0',
			},
		},
		tableRow: {
			[theme.breakpoints.down('md')]: {
				borderBottom: '1px solid #333',
			},
		},
	})
);

export default function PaymentMethodsPage() {
	const theme = useTheme();
	const { search } = useLocation();
	const userService = new UserService();
	const queryParams = parseQueryString(search);

	const { authBody, updateAuthData, isTeamMember } = useContext(AuthContext);
	const { showSnackBar } = useContext(SnackBarContext);

	const [addCardVisible, setAddCardVisible] = useState<boolean>(false);
	const [editingCard, setEditingCard] = useState<CCInterface | undefined>();
	const [deletingCard, setDeletingCard] = useState<CCInterface | undefined>();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [cards, setCards] = useState<CCInterface[]>([]);

	const classes = useStyles({});

	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;
	const navigate = useNavigate();

	if (isTeamMember || !checkPermsHelper(['Customer Billings'], [], authBody)) navigate(getFirstMenuItem(authBody).url);

	const loadCards = useCallback(async () => {
		if (!authBody) return;
		setIsLoading(true);
		try {
			const list = await userService.getCards(authBody.id);
			setCards(list);
			if (!list.length) setAddCardVisible(true);
		} catch (e) {
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadCards().then();
	}, []);

	const onAddCard = async () => {
		try {
			setEditingCard(undefined);
			setAddCardVisible(false);
			updateAuthData();
			if (queryParams.redirect) {
				const newRedirect = String(queryParams.redirect).replace(/'/g, '');
				navigate(newRedirect);
			} else {
				loadCards().then();
			}
		} catch (e) {
			showSnackBar((e as Error).message);
		}
	};

	const onAddCardClose = () => {
		setAddCardVisible(false);
		setEditingCard(undefined);
	};

	const onAddCardShow = () => {
		setAddCardVisible(true);
	};

	const handleEditCard = (cc: CCInterface) => {
		setEditingCard(cc);
		setAddCardVisible(true);
	};

	const handleSetDefault = async (cardId: string) => {
		if (!authBody) return;
		try {
			await userService.setDefaultCard(authBody.id, cardId);
			loadCards().then();
		} catch (e) {
			showSnackBar((e as Error).message);
		}
	};

	const closeDialog = () => {
		setDeletingCard(undefined);
	};

	const onDeleteRequest = async (cc: CCInterface) => {
		setDeletingCard(cc);
	};

	const handleDeleteCard = async () => {
		if (!authBody) return;
		try {
			if (deletingCard && deletingCard.id) await userService.deleteCard(authBody.id, deletingCard.id);
			closeDialog();
			updateAuthData();
			loadCards().then();
		} catch (e) {
			showSnackBar((e as Error).message);
		}
	};

	return (
		<BasePage>
			<Helmet>
				<title>{siteTitleHelper()}</title>
				<meta name="description" content={siteDescriptionHelper()} />
			</Helmet>

			<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
				<Grid item xs={12} className={classes.top}>
					<BreadcrumbsComponent primary="Account Settings:" secondary="Payment" />
				</Grid>
				<Grid item md={10} xl={7} xs={12} className={classes.innerWrap}>
					<Paper className={classes.inner}>
						<Paper className={classes.title}>
							<Typography variant="body2">PAYMENT METHODS</Typography>
						</Paper>
						<div className={classes.addBtnWrapper}>
							<Button
								variant="contained"
								color="primary"
								disabled={isLoading}
								endIcon={<AddIcon />}
								size="large"
								onClick={onAddCardShow}
							>
								Add a new card
							</Button>
						</div>

						<Divider />

						<Grid container>
							<Grid item xs={12}>
								{isLoading && <LinearProgress />}
								{!isLoading && (
									<Table aria-label="simple table">
										<TableBody>
											{cards.map((cc: any) => (
												<TableRow className={classes.tableRow} key={cc.id}>
													<TableCell className={classes.tableCell}>
														<img
															src={CCAvatar(cc.brand)}
															width={70}
															alt={cc.brand}
															style={{ marginRight: 15, marginBottom: '-15px' }}
														/>
														<Typography component="span">
															<b>{` *${cc.last4}`}</b>
															{cc.isDefault && ' (Primary)'}
														</Typography>
													</TableCell>

													<TableCell className={classes.tableCell}>
														<Typography>
															Exp. - {cc.exp_month} / {cc.exp_year}
														</Typography>
													</TableCell>

													<TableCell align="right" className={classes.tableCell}>
														{!cc.isDefault && (
															<Button
																variant="contained"
																endIcon={<StarIcon />}
																color="primary"
																onClick={() => handleSetDefault(cc.id)}
															>
																Make primary
															</Button>
														)}
													</TableCell>

													<TableCell align="right" className={classes.tableCell}>
														<Button
															variant="contained"
															endIcon={<ChevronRightIcon />}
															color="primary"
															onClick={() => handleEditCard(cc)}
														>
															Edit
														</Button>
														<Button
															variant="contained"
															endIcon={<DeleteIcon />}
															color="secondary"
															onClick={() => onDeleteRequest(cc)}
															style={{ marginLeft: 15 }}
														>
															Delete
														</Button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								)}
							</Grid>
						</Grid>
					</Paper>
				</Grid>
			</Grid>

			<AddCCComponent
				open={addCardVisible}
				onClose={onAddCardClose}
				userId={String(authBody?.id)}
				onAdded={onAddCard}
				initialValues={editingCard}
			/>

			<Dialog open={!!deletingCard} onClose={closeDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
				<DialogActions>
					<Button onClick={closeDialog} color="primary">
						Cancel
					</Button>
					<Button onClick={handleDeleteCard} color="primary" autoFocus>
						Ok
					</Button>
				</DialogActions>
			</Dialog>
		</BasePage>
	);
}
