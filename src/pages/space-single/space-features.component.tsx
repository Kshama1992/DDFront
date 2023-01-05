import React from 'react';
import pluralize from 'pluralize';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

interface SpaceFeaturesComponentProps {
	space: SpaceInterface;
}

const P_SIZE = 14;
const TITLE_SIZE = 17;

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		spaceTypeTitle: {
			fontWeight: 500,
			fontSize: TITLE_SIZE,
			color: '#333',
			width: '100%',
			position: 'relative',
			display: 'inline-block',
			textAlign: 'left',
			marginLeft: 20,
			marginBottom: 20,
			[theme.breakpoints.down('md')]: {
				marginBottom: 10,
				marginTop: 50,
				fontSize: TITLE_SIZE + 1,
				textAlign: 'дуае',
				'&::before': {
					content: `''`,
					position: 'absolute',
					left: 0,
					top: 30,
					width: '10%',
					height: 1,
					backgroundColor: '#2F96E6',
				},
			},
		},
		spaceDetailsType: {
			padding: '0 15px 15px 20px',

			// borderBottom: '1px solid  #dfdfdf',
			[theme.breakpoints.down('md')]: {
				padding: '0 5% 0 5%',
			},
			'& p, & span': {
				fontSize: P_SIZE,
				fontWeight: 300,
				color: '#333',
				fontFamily: '"Lato", sans-serif',
			},
			'& .read-more-button': {
				cursor: 'pointer',
				color: theme.palette.primary.main,
				display: 'inline',
			},
		},
		spaceFeatures: {
			padding: '5px 15px 5px 20px',

			// borderBottom: '1px solid  #dfdfdf',
			[theme.breakpoints.down('md')]: {
				padding: '5px 5% 5px 5%',
			},
			'& p': {
				fontSize: P_SIZE,
			},
		},
	})
);

export default function SpaceFeaturesComponent({ space }: SpaceFeaturesComponentProps) {
	const classes = useStyles();

	return (
		<>
			{!!space.spaceType && (
				<>
					<Grid item xs={6} className={classes.spaceFeatures}>
						<Typography style={{ fontWeight: 500 }}>Space Type</Typography>
					</Grid>
					<Grid item xs={6} className={classes.spaceFeatures}>
						<Typography>{space.spaceType.name}</Typography>
					</Grid>
				</>
			)}
			{!!space.chargeType && (
				<>
					<Grid item xs={6} className={classes.spaceFeatures}>
						<Typography style={{ fontWeight: 500 }}>Charge Type</Typography>
					</Grid>
					<Grid item xs={6} className={classes.spaceFeatures}>
						<Typography>{space.chargeType}</Typography>
					</Grid>
				</>
			)}

			<Grid item xs={6} className={classes.spaceFeatures}>
				<Typography style={{ fontWeight: 500 }}>Capacity</Typography>
			</Grid>
			{space.capacity && (
				<Grid item xs={6} className={classes.spaceFeatures}>
					<Typography>{Number(space.capacity)}</Typography>
				</Grid>
			)}

			{!!space.roundHours && space.roundHours > 0 && (
				<>
					<Grid item xs={12}>
						<Typography className={classes.spaceTypeTitle}>Reservation Requirements</Typography>
					</Grid>
					<Grid item xs={12} className={classes.spaceDetailsType}>
						<Typography>{pluralize('hours', space.roundHours, true)} minimum</Typography>
					</Grid>
				</>
			)}
		</>
	);
}
