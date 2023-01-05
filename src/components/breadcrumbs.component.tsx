import React from 'react';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			[theme.breakpoints.down('md')]: {
				width: '100%',
				maxWidth: '100%',
				clear: 'both',
			},
		},
	})
);

export default function BreadcrumbsComponent({ primary, secondary = '' }: { primary: string; secondary?: string }) {
	const classes = useStyles({});

	return (
		<Typography component="h1" variant="body1" className={classes.root}>
			<b>{primary}</b> {secondary}
		</Typography>
	);
}
