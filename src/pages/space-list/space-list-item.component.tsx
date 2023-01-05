import React, { memo, useContext, useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import NearMeIcon from '@mui/icons-material/NearMe';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import { getSpaceUrl } from 'dd-common-blocks';
import ReservationInterface from 'dd-common-blocks/dist/interface/reservation.interface';
import { AuthContext, DEFAULT_LOCATION } from '@context/auth.context';
import distanceFromTo from '@helpers/space/distance-from.helper';
import SpaceSeatsComponent from '@shared-components/space-seats.component';
import SpaceAccessHoursComponent from '@shared-components/space-access-hours.component';
import SpacePriceComponent from '@shared-components/space-price.component';
import AddressString from '@shared-components/address-string.component';
import { getWebpImageUrl } from '@helpers/webp-support.helper';
import SpaceListItemComponentStyles from './space-list-item.component.styles';

function SpaceListItem({
	space,
	onMouseEnter,
	onMouseLeave,
	style,
}: {
	space: SpaceInterface;
	onMouseEnter?: (space: SpaceInterface) => any;
	onMouseLeave?: (space: SpaceInterface) => any;
	style?: any;
}) {
	const classes = SpaceListItemComponentStyles();
	const navigate = useNavigate();
	const [hover, setHover] = useState(false);
	const { userLocation, userCheckins } = useContext(AuthContext);
	const [longitude, latitude] = space.venue.coordinates.coordinates;

	const spacePhotoUrl = getWebpImageUrl(
		`${process.env.RAZZLE_RUNTIME_MEDIA_URL}//307x176_cover${space.photos.length ? space.photos[0].url : space.venue.photos![0].url}`
	);

	const handleMouseEnter = () => {
		setHover(true);
		if (onMouseEnter) onMouseEnter(space);
	};

	const handleMouseLeave = () => {
		setHover(false);
		if (onMouseLeave) onMouseLeave(space);
	};

	const handleLinkClick = () => {
		const spaceCheckin = userCheckins.find((uc: ReservationInterface) => uc.spaceId === space.id);
		if (spaceCheckin) {
			navigate('/checkout');
		} else {
			navigate(getSpaceUrl(space));
		}
	};

	return (
		<Card onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={style}>
			<CardActionArea onClick={handleLinkClick}>
				<CardMedia className={classes.media} image={spacePhotoUrl} title={space.name}>
					{space.spaceType.logicType !== SpaceTypeLogicType.INFO && (
						<div className={classes.cardSpaceSits}>
							<SpaceSeatsComponent space={space} />
						</div>
					)}
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
							<Typography gutterBottom component="h4" className={classes.title}>
								{space.name}
							</Typography>
						</Grid>
						{space.spaceType.logicType !== SpaceTypeLogicType.INFO && (
							<Grid item xs={4} md={4} style={{ textAlign: 'right', paddingBottom: 0 }}>
								<SpacePriceComponent space={space} className={classes.price} />
							</Grid>
						)}

						<Grid item xs={8} md={8} style={{ paddingTop: 0 }}>
							<Typography component="h4" className={classes.subtitle}>
								{space.venue.name}
							</Typography>
						</Grid>

						<Grid item xs={7} style={{ paddingTop: 0, paddingRight: 0 }}>
							<AddressString className={classes.address} addressString={`${space.venue.address} ${space.venue.address2}`} />
						</Grid>
						<Grid item xs={5} style={{ textAlign: 'right', paddingTop: 0 }}>
							<Typography variant="caption" color="textSecondary" className={classes.distance}>
								<NearMeIcon className={classes.distanceIcon} />{' '}
								{distanceFromTo(
									userLocation?.countryCode || DEFAULT_LOCATION.countryCode,
									{
										latitude: userLocation?.latitude || DEFAULT_LOCATION.latitude,
										longitude: userLocation?.longitude || DEFAULT_LOCATION.longitude,
									},
									{ latitude, longitude }
								)}
							</Typography>
						</Grid>
					</Grid>
				</CardContent>
			</CardActionArea>
		</Card>
	);
}

export default memo(SpaceListItem);
