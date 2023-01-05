import React from 'react';
import { useLocation, Link } from 'react-router-dom';

import { Helmet } from 'react-helmet';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import BasePage from './base.page';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			overflowX: 'hidden',
		},
		overview: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			textAlign: 'center',
			padding: '150px 0 0 0',
			[theme.breakpoints.down('md')]: {
				padding: '100px 0 0 0',
			},
		},
		link: {
			textDecoration: 'none',
			outline: '',
		},
		mainBanner: {
			background: 'url(/images/mainBanner1.png) no-repeat center/cover',
			height: 'calc(100vh - 70px)',
			backgroundSize: 'cover',
		},
		headline: {
			color: '#3698e3',
			lineHeight: '1.4em',
			fontSize: 50,
			marginBottom: 0,
			fontFamily: '"Europa", sans-serif',
			[theme.breakpoints.down('md')]: {
				fontSize: '30px !important',
			},
			[theme.breakpoints.down('md')]: {
				fontSize: 35,
			},
		},
		headlineDiv: {
			maxWidth: '450px',
			[theme.breakpoints.down('md')]: {
				maxWidth: '250px !important',
				padding: '0px !important',
			},
			[theme.breakpoints.down('md')]: {
				maxWidth: '300px',
			},
		},
		subtitleDiv: {
			maxWidth: '600px',
			[theme.breakpoints.down('md')]: {
				maxWidth: '400px',
			},
			[theme.breakpoints.down('md')]: {
				maxWidth: '300px',
			},
		},
		subtitle: {
			color: '#333a43',
			fontWeight: 400,
			fontSize: 23,
			lineHeight: '35px',
			fontFamily: '"Europa", sans-serif',
			marginTop: '15px',
			[theme.breakpoints.down('md')]: {
				fontSize: '15px !important',
				lineHeight: '25px !important ',
			},
			[theme.breakpoints.down('md')]: {
				fontSize: 18,
				lineHeight: '30px',
			},
		},
		bannerButton: {
			height: 'auto',
			padding: '15px 30px',
			marginTop: 60,
			color: '#fff',
			background: 'linear-gradient(to right,#3698e3, #14a3cc)',
			'&:hover': {
				background: 'linear-gradient(to right,#3698e3, #3698e3)',
			},
			[theme.breakpoints.down('md')]: {
				padding: '15px 30px',
				whiteSpace: 'nowrap',
				marginTop: 20,
				fontSize: '12px',
			},
		},
	})
);

const NotFoundPage = () => {
	const classes = useStyles();
	const { pathname } = useLocation();

	return (
		<BasePage>
			<Helmet>
				<title>Error 404 not found</title>
			</Helmet>
			<div id="main" className={classes.root}>
				<div className={classes.mainBanner}>
					<Grid container className={classes.overview}>
						<Grid item xs={12} sm={12} md={6} lg={6} className={classes.headlineDiv}>
							<Typography className={classes.headline}>Error 404 not found</Typography>
						</Grid>
						<Grid item xs={12} sm={12} md={10} lg={7} className={classes.subtitleDiv}>
							<Typography className={classes.subtitle}>This path {pathname} does not exist</Typography>
						</Grid>
						<Link to="/" className={classes.link}>
							<Button className={classes.bannerButton}>Go home</Button>
						</Link>
					</Grid>
				</div>
			</div>
		</BasePage>
	);
};

export default NotFoundPage;
