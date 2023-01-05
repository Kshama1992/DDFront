import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import useStyles from './header-landing-styles';

function HeaderLanding() {
	const classes = useStyles({});
	// @ts-ignore
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'), { noSsr: false });

	const renderAuthBtns = () => (
		<div className={classes.miniContainer}>
			<div className={classes.ButtonBlock}>
				<Button component={Link} to="/sign" className={`${classes.btnBase} ${classes.signInDesktop}`}>
					SIGN IN
				</Button>
			</div>
			<div className={classes.ButtonSignup}>
				<Button component={Link} to="/sign" className={`${classes.btnBase} ${classes.loginDesktop}`}>
					become a host
				</Button>
			</div>
		</div>
	);

	return (
		<Paper className={classes.root}>
			<Grid container direction="row" justifyContent="space-between" alignItems="center">
				<Grid item xs={8} sm={2} xl={1} style={{ textAlign: 'center' }}>
					<Link to="/" className={classes.link}>
						<img width={123} height={50} className={classes.headerUserLogo} src={`/images/logo_white.png`} alt={`Dropdesk`} />
					</Link>
				</Grid>

				{isMobile && <Grid item xs={2} style={{ textAlign: 'center' }} />}

				{!isMobile && (
					<Grid item xs={12} sm={4}>
						{renderAuthBtns()}
					</Grid>
				)}
			</Grid>
		</Paper>
	);
}

export default memo(HeaderLanding);
