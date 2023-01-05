import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';

export default function SpaceSkeletonComponent() {
	return (
		<>
			<Skeleton variant="rectangular" width="100%" height={176} />
			<Grid container>
				<Grid item xs={12} md={12} style={{ padding: 10 }}>
					<Skeleton variant="text" width="65%" style={{ float: 'left' }} />
					<Skeleton variant="text" width="30%" style={{ float: 'right' }} />
					<Skeleton variant="text" width="45%" style={{ float: 'left' }} />
					<Skeleton variant="text" width="30%" style={{ float: 'right' }} />
					<Skeleton variant="text" width="55%" style={{ float: 'left' }} />
					<Skeleton variant="text" width="10%" style={{ float: 'right' }} />
				</Grid>
			</Grid>
		</>
	);
}
