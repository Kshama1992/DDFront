import dayjs from 'dayjs';
import React, { useCallback, useState, useEffect } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Helmet } from 'react-helmet';
import CircularProgress from '@mui/material/CircularProgress';
import Accordion from '@mui/material/Accordion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Toolbar from '@mui/material/Toolbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { useNavigate, useParams } from 'react-router-dom';
import LogService, { LogItemInterface } from '@service/log.service';
import { IconButton } from '@mui/material';
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
			margin: 0,
			marginLeft: 90,
		},
		rightSide: {
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				marginLeft: 0,
			},
		},
		leftSide: {
			maxWidth: 300,
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				width: '100%',
				position: 'relative',
			},
		},
		loaderWrapper: {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			background: 'rgba(255,255,255,0.31)',
			zIndex: 9,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		noItemsText: {
			width: '100%',
			textAlign: 'center',
			padding: 15,
			boxSizing: 'border-box',
		},
	})
);

export default function LogFilePage() {
	const theme = useTheme();
	const classes = useStyles({});
	const logService = new LogService();
	const navigate = useNavigate();
	const { fileName, logType } = useParams();

	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;
	const [log, setLog] = useState<LogItemInterface[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const getLog = useCallback(async () => {
		if (!fileName) return navigate(-1);
		try {
			const item = await logService.getFile(logType, fileName);
			setLog(item);
		} catch (e) {
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	}, [fileName]);

	useEffect(() => {
		getLog().then();
	}, [fileName]);

	const tableRows = (li: LogItemInterface) => {
		return Object.keys(li).map((keyName: string) => (
			<TableRow key={keyName}>
				<TableCell component="th" scope="row">
					<b>{keyName}</b>
				</TableCell>
				<TableCell>
					<p
						dangerouslySetInnerHTML={{
							// @ts-ignore
							__html: li[keyName],
						}}
					/>
				</TableCell>
			</TableRow>
		));
	};

	return (
		<BasePage>
			<Helmet>
				<title>App log - {fileName}</title>
				<meta name="description" content={`App log - ${fileName}`} />
			</Helmet>

			<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
				<Grid item xs={12} md={2} xl={2} className={classes.leftSide} />

				<Grid item xs={12} md={9} xl={10} className={classes.rightSide}>
					<Grid container spacing={3}>
						<Grid item sm={12} xs={12} style={{ position: 'relative' }}>
							<Grid container>
								<Grid item xs={6}>
									<BreadcrumbsComponent primary={`App logs: ${fileName}`} />
								</Grid>
							</Grid>
						</Grid>
						<Grid item lg={12} md={12} xs={12}>
							<Paper>
								<Toolbar>
									{/* <Toolbar style={{ justifyContent: 'space-between' }}>*/}
									<IconButton
										color="primary"
										aria-label="upload picture"
										component="span"
										onClick={() => navigate(-1)}
										size="large"
									>
										<ArrowBackIcon />
									</IconButton>

									<Typography color="inherit" variant="subtitle1" component="div">
										Logs for {fileName}
									</Typography>
								</Toolbar>
								{isLoading && (
									<div className={classes.loaderWrapper}>
										<CircularProgress />
									</div>
								)}
								{!isLoading && log.length === 0 && <Typography className={classes.noItemsText}>No Items</Typography>}
								{!isLoading &&
									log.map((li, i) => (
										<Accordion key={i}>
											<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
												<Typography>
													<small>
														<b>{dayjs(li.timestamp).format('HH:mm:ss')}</b>: {li.message}
													</small>
												</Typography>
											</AccordionSummary>
											<AccordionDetails>
												<TableContainer>
													<Table>
														<TableBody>{tableRows(li)}</TableBody>
													</Table>
												</TableContainer>
											</AccordionDetails>
										</Accordion>
									))}
							</Paper>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</BasePage>
	);
}
