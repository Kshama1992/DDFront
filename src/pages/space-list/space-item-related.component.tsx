import React, { memo, useState } from 'react';
import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import { getSpaceUrl } from 'dd-common-blocks';
import SpaceSeatsComponent from '@shared-components/space-seats.component';
import SpaceAccessHoursComponent from '@shared-components/space-access-hours.component';
import SpacePriceComponent from '@shared-components/space-price.component';
import { getWebpImageUrl } from '@helpers/webp-support.helper';
import AddressString from '@shared-components/address-string.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		title: {
			padding: 0,
			fontSize: 17,
			marginBottom: 0,

			[theme.breakpoints.only('lg')]: {
				fontSize: 14,
			},
		},
		subtitle: {
			padding: 0,
			fontSize: 14,
			[theme.breakpoints.only('lg')]: {
				fontSize: 12,
			},
		},
		price: {
			color: '#f7ac38',
			fontSize: 17,
			[theme.breakpoints.only('lg')]: {
				fontSize: 13,
				fontWeight: 500,
			},
		},
		openHours: {},
		address: {
			padding: 0,
			fontSize: 12,
			whiteSpace: 'pre-line',
			[theme.breakpoints.only('lg')]: {
				fontSize: 11,
			},
		},
		distance: {
			color: theme.palette.primary.main,
			fontSize: 12,
			padding: 0,
		},
		distanceIcon: {
			fontSize: 12,
			marginBottom: -2,
		},
		media: {
			height: 176,
			position: 'relative',
			[theme.breakpoints.down('md')]: {
				margin: '15px 15px 0 15px',
			},
		},
		cardSpaceHoverLayer: {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			background: 'rgba(54, 152, 227, 0.61)',
			transition: 'all .3s ease',
		},
		cardSpaceHoverButton: {
			marginTop: 0,
			transition: 'all .3s ease',
			backgroundColor: '#f7ac38',
			padding: '17px 30px',
			color: '#fff',
		},
		cardSpaceSits: {
			position: 'absolute',
			top: 5,
			right: 5,
			borderRadius: 3,
			height: 'auto',
			background: '#20232a',
			color: '#fff',
			padding: '0 10px',
			zIndex: 100,
		},
		cardSpaceTime: {
			position: 'absolute',
			bottom: 5,
			right: 5,
			borderRadius: 3,
			height: 'auto',
			color: '#fff',
			padding: '0 10px',
			zIndex: 100,
			'& .MuiSvgIcon-root': {
				fontSize: 15,
				marginBottom: -2,
				marginRight: 2,
			},
		},
		cardSitsText: {
			color: '#fff',
			margin: 0,
			fontSize: 14,
		},
	})
);

function SpaceItemRelated({ space }: { space: SpaceInterface }) {
	const classes = useStyles();

	const [hover, setHover] = useState(false);

	return (
		<Card onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ margin: 10 }}>
			<CardActionArea component={Link} to={getSpaceUrl(space)}>
				<CardMedia
					className={classes.media}
					image={getWebpImageUrl(
						process.env.RAZZLE_RUNTIME_MEDIA_URL + (space.photos.length ? space.photos[0].url : space.venue.photos![0].url)
					)}
					title={space.name}
				>
					<div className={classes.cardSpaceSits}>
						<SpaceSeatsComponent space={space} />
					</div>
					<div className={classes.cardSpaceTime}>
						<SpaceAccessHoursComponent space={space} />
					</div>
					<div className={classes.cardSpaceHoverLayer} style={{ opacity: hover ? 1 : 0 }}>
						<Button variant="contained" className={classes.cardSpaceHoverButton} component="span">
							View Details
						</Button>
					</div>
				</CardMedia>
				<CardContent style={{ padding: 10 }}>
					<Grid container spacing={2}>
						<Grid item xs={8} md={8} style={{ paddingBottom: 0 }}>
							<Typography gutterBottom component="h3" className={classes.title}>
								{space.name}
							</Typography>
						</Grid>
						<Grid item xs={4} md={4} style={{ textAlign: 'right', paddingBottom: 0 }}>
							<SpacePriceComponent space={space} className={classes.price} />
						</Grid>

						<Grid item xs={8} md={8} style={{ paddingTop: 0 }}>
							<Typography component="h4" className={classes.subtitle}>
								{space.venue.name}
							</Typography>
						</Grid>

						<Grid item xs={7} style={{ paddingTop: 0, paddingRight: 0 }}>
							<AddressString className={classes.address} addressString={`${space.venue.address} ${space.venue.address2}`} />
						</Grid>
					</Grid>
				</CardContent>
			</CardActionArea>
		</Card>
	);
}

export default memo(SpaceItemRelated);
