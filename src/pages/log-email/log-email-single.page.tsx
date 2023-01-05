import React, { useCallback, useState, useEffect } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import ReactJson from 'react-json-view';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Helmet } from 'react-helmet';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LogService, { EmailLogInterface } from '@service/log.service';
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

export default function LogEmailSinglePage() {
	const theme = useTheme();
	const classes = useStyles({});
	const logService = new LogService();
	const navigate = useNavigate();
	const { emailLogId } = useParams();

	const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: false });
	const rootHtmlClass = isMobile ? classes.rootMobile : classes.root;
	const [log, setLog] = useState<EmailLogInterface>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const getLog = useCallback(async () => {
		if (!emailLogId) return navigate(-1);
		try {
			const item = await logService.getEmailLog(+emailLogId);
			setLog(item);
		} catch (e) {
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	}, [emailLogId]);

	useEffect(() => {
		getLog().then();
	}, [emailLogId]);

	return (
		<BasePage>
			<Helmet>
				<title>App log</title>
				<meta name="description" content={`App log`} />
			</Helmet>

			<Grid container spacing={3} className={rootHtmlClass} direction="row" alignItems="flex-start">
				<Grid item xs={12} md={2} xl={2} className={classes.leftSide} />

				<Grid item xs={12} md={9} xl={10} className={classes.rightSide}>
					<Grid container spacing={3}>
						<Grid item sm={12} xs={12} style={{ position: 'relative' }}>
							<Grid container>
								<Grid item xs={6}>
									<IconButton color="primary" aria-label="upload picture" component={Link} to={'/dashboard/log-email'}>
										<ArrowBackIcon />
									</IconButton>
									<BreadcrumbsComponent primary={`App log`} />
								</Grid>
							</Grid>
						</Grid>
						{isLoading && (
							<Grid item lg={12} md={12} xs={12}>
								<Paper>
									<div className={classes.loaderWrapper}>
										<CircularProgress />
									</div>
								</Paper>
							</Grid>
						)}

						{!isLoading && log && (
							<Grid item lg={12} md={12} xs={12}>
								<Paper>
									<Grid container spacing={3} marginLeft={1}>
										<Grid item xs={12} md={3}>
											<Typography variant="body1" gutterBottom component="div">
												Subject
											</Typography>
											<Typography variant="body2" gutterBottom component="div">
												{log.subject}
											</Typography>
										</Grid>
										<Grid item xs={12} md={3}>
											<Typography variant="body1" gutterBottom component="div">
												From
											</Typography>
											<Typography variant="body2" gutterBottom component="div">
												{log.from}
											</Typography>
										</Grid>
										<Grid item xs={12} md={3}>
											<Typography variant="body1" gutterBottom component="div">
												To
											</Typography>
											<Typography variant="body2" gutterBottom component="div">
												{log.to}
											</Typography>
										</Grid>
										<Grid item xs={12} md={3}>
											<Typography variant="body1" gutterBottom component="div">
												Brand
											</Typography>
											<Typography variant="body2" gutterBottom component={Link} to={`/dashboard/brand/${log.brandId}`}>
												{log.brand.name}
											</Typography>
										</Grid>
										<Grid item xs={12} md={3}>
											<Typography variant="body1" gutterBottom component="div">
												Status
											</Typography>
											<Typography variant="body2" gutterBottom component="div">
												{log.status}
											</Typography>
										</Grid>
										<Grid item xs={12} md={3}>
											<Typography variant="body1" gutterBottom component="div">
												Created
											</Typography>
											<Typography variant="body2" gutterBottom component="div">
												{log.createdAt}
											</Typography>
										</Grid>
										<Grid item xs={12} md={3}>
											<Typography variant="body1" gutterBottom component="div">
												Template used
											</Typography>
											<Typography
												variant="body2"
												gutterBottom
												component={Link}
												to={`/dashboard/email-templates/${log.templateId}`}
											>
												{log.template.name}
											</Typography>
										</Grid>
									</Grid>
								</Paper>
								<br />

								<Accordion>
									<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
										<Typography>Email variables</Typography>
									</AccordionSummary>
									<AccordionDetails>{log && <ReactJson src={log.variables} />}</AccordionDetails>
								</Accordion>

								<Accordion>
									<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
										<Typography>Response from email provider</Typography>
									</AccordionSummary>
									<AccordionDetails>{log && <ReactJson src={log.statusMessage} />}</AccordionDetails>
								</Accordion>

								<Accordion>
									<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
										<Typography>Template object</Typography>
									</AccordionSummary>
									<AccordionDetails>{log && <ReactJson src={log.template} />}</AccordionDetails>
								</Accordion>

								<Accordion>
									<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
										<Typography>Template with variables applied preview</Typography>
									</AccordionSummary>
									<AccordionDetails>
										{log && (
											<iframe
												style={{ width: '100%', height: 700, border: 'none', background: 'transparent' }}
												src={'data:text/html,' + encodeURIComponent(log.message)}
											/>
										)}
									</AccordionDetails>
								</Accordion>

								<Accordion>
									<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
										<Typography>Template preview</Typography>
									</AccordionSummary>
									<AccordionDetails>
										{log && (
											<iframe
												style={{ width: '100%', height: 700, border: 'none', background: 'transparent' }}
												src={'data:text/html,' + encodeURIComponent(log.template.html)}
											/>
										)}
									</AccordionDetails>
								</Accordion>
							</Grid>
						)}
					</Grid>
				</Grid>
			</Grid>
		</BasePage>
	);
}
