import React, { memo } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import SpaceAmenityInterface from 'dd-common-blocks/dist/interface/space-amenity.interface';
import AmenityPriceComponent from './amenity-price.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		spaceTypeTitle: {
			fontWeight: 500,
			fontSize: 17,
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
				fontSize: 18,
				textAlign: 'left',
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
		sectionWrapDivider: {
			paddingBottom: 30,
			paddingTop: 35,
			paddingLeft: 25,
			borderTop: '1px solid #dfdfdf',
			// borderBottom: '1px solid #dfdfdf',
			[theme.breakpoints.down('md')]: {
				paddingLeft: 0,
				overflow: 'hidden',
				marginBottom: 15,
				paddingTop: 0,
				paddingBottom: 0,
				border: 'none',
			},
		},
		amenityName: {
			padding: '15px 15px 15px 20px',
			[theme.breakpoints.down('md')]: {
				padding: '15px 5% 15px 5%',
				'& p, & span': {
					fontSize: 12,
				},
			},
			'& p, & span': {
				fontSize: 14,
			},
		},
		amenityPrice: {
			'&::before': {
				content: `'\\0028 '`,
				marginRight: 2,
			},
			'&::after': {
				content: `' \\0029'`,
				marginLeft: 2,
			},
			display: 'inline',
			marginLeft: 5,
			fontWeight: 600,
		},
		titleIcon: {
			color: theme.palette.primary.main,
			marginRight: 15,
			marginBottom: -5,
			display: 'inline',
		},
	})
);

function SpaceAmenityComponent({ amenities, currency }: { amenities: SpaceAmenityInterface[]; currency: string }) {
	const classes = useStyles();

	if (!amenities || !amenities.length) return null;

	return (
		<Grid item xs={12} className={classes.sectionWrapDivider}>
			<Grid container>
				<Grid item xs={12}>
					<Typography className={classes.spaceTypeTitle}>Amenities</Typography>
				</Grid>

				<Grid item xs={12}>
					<Grid container>
						{amenities.map((amenity: SpaceAmenityInterface) => (
							<Grid item lg={4} xs={12} key={amenity.id} className={classes.amenityName}>
								<Typography style={{ float: 'left' }}>
									<CheckIcon className={classes.titleIcon} />
								</Typography>
								<Typography>
									{amenity.name || amenity.amenity!.name}
									{amenity.price > 0 && (
										<AmenityPriceComponent className={classes.amenityPrice} amenity={amenity} currency={currency} />
									)}
									{amenity.description && (
										<>
											{' '}
											<br />
											<small>{amenity.description}</small>
										</>
									)}
								</Typography>
							</Grid>
						))}
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}

export default memo(SpaceAmenityComponent);
