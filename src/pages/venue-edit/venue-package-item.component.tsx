import React, { memo, useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import SpaceInterface, { SpaceStatus } from 'dd-common-blocks/dist/interface/space.interface';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import SpacePriceComponent from '@shared-components/space-price.component';
import SpaceSeatsComponent from '@shared-components/space-seats.component';
import SpaceAccessHoursComponent from '@shared-components/space-access-hours.component';
import AddressString from '@shared-components/address-string.component';
import VenuePackageItemStyle from './style/venue-package-item.style';

function VenuePackageItem({ space, showHover = true }: { space: SpaceInterface; showHover?: boolean }) {
	const classes = VenuePackageItemStyle();
	const [hover, setHover] = useState(false);

	return (
		<Card onMouseEnter={() => showHover && setHover(true)} onMouseLeave={() => showHover && setHover(false)}>
			<CardActionArea component={Link} to={`/dashboard/venue/${space.venue.id}/space/${space.id}`}>
				<CardMedia
					className={classes.media}
					image={`${process.env.RAZZLE_RUNTIME_MEDIA_URL}/434x176_cover${
						space.photos.length ? space.photos[0].url : space.venue.photos![0].url
					}`}
					title={space.name}
				>
					{space.spaceType.logicType !== SpaceTypeLogicType.INFO && (
						<div className={classes.cardSpaceSits}>
							<SpaceSeatsComponent space={space} />
						</div>
					)}

					{!!space.createdBy && (
						<div className={classes.cardSpaceCreatedBy}>
							<Typography component="p" className={classes.cardSitsText}>
								Created by: {space.createdBy.firstname} {space.createdBy.lastname}
							</Typography>
						</div>
					)}

					{space.status === SpaceStatus.UNPUBLISED && <Typography className={classes.badgeUnpublished}>Unpublished</Typography>}
					{space.status === SpaceStatus.DELETED && <Typography className={classes.badgeUnpublished}>DELETED</Typography>}

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
						{space.spaceType.logicType !== SpaceTypeLogicType.INFO && (
							<Grid item xs={4} md={4} style={{ textAlign: 'right', paddingBottom: 0 }}>
								<SpacePriceComponent space={space} className={classes.price} />
							</Grid>
						)}

						<Grid item xs={8} md={8} style={{ paddingTop: 0 }}>
							<Typography component="h4" className={classes.subtitle}>
								{space.venue.name} - {space.venue!.brand!.name}
							</Typography>
						</Grid>

						<Grid item xs={7} style={{ paddingTop: 0 }}>
							<AddressString
								variant="caption"
								className={classes.address}
								addressString={`${space.venue.address} ${space.venue.address2}`}
							/>
						</Grid>
					</Grid>
				</CardContent>
			</CardActionArea>
		</Card>
	);
}

export default memo(VenuePackageItem);
