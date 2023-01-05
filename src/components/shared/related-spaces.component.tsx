import React, { useCallback, useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import SpaceInterface, { SpaceStatus } from 'dd-common-blocks/dist/interface/space.interface';
import SpaceItemRelated from '@pages/space-list/space-item-related.component';
import SpaceSinglePageStyle from '@pages/space-single/style/space-single.page.style';
import SpaceService from '@service/space.service';
import useMediaQuery from '@mui/material/useMediaQuery';

interface RelatedSpacesParamsInterface {
	venueId?: number;
	country?: string;
	city?: string;
	spaceTypeId?: number;
	excludeIds?: number[];
	limit?: number;
	longitude?: string;
	latitude?: string;
}

function RelatedSpaceComponent({ params, style }: { params: RelatedSpacesParamsInterface; style?: any }) {
	const classes = SpaceSinglePageStyle();
	const spaceService = new SpaceService();

	// @ts-ignore
	const isMobile = useMediaQuery((t) => t.breakpoints.down('md'), { noSsr: false });

	const [isLoading, setIsLoading] = useState(true);
	const [relatedSpaces, setRelatedSpaces] = useState<SpaceInterface[]>([]);

	const responsive = {
		uhd: {
			breakpoint: { max: 4000, min: 3000 },
			items: 5,
		},
		desktop: {
			breakpoint: { max: 3000, min: 1024 },
			items: 3,
		},
		tablet: {
			breakpoint: { max: 1024, min: 464 },
			items: 1,
		},
		mobile: {
			breakpoint: { max: 464, min: 0 },
			items: 1,
		},
	};

	const loadRelated = useCallback(async () => {
		const [spaces] = await spaceService.list({
			...params,
			status: SpaceStatus.PUBLISH,
			limit: 6,
		});
		setRelatedSpaces(spaces);
		setIsLoading(false);
	}, [params]);

	useEffect(() => {
		loadRelated().then();
	}, [params]);

	if (isLoading) return <LinearProgress />;

	if (relatedSpaces.length === 0) return null;

	return (
		<Grid item xs={12} className={classes.sectionWrapDivider} style={style}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography className={classes.spaceTypeTitle}>Related Packages</Typography>
				</Grid>

				<Grid item xs={12}>
					<Carousel
						responsive={responsive}
						swipeable
						draggable
						showDots={false}
						ssr
						infinite
						keyBoardControl={false}
						slidesToSlide={isMobile ? 1 : 3}
						containerClass="carousel-container"
						removeArrowOnDeviceType={['tablet', 'mobile']}
						dotListClass="custom-dot-list-style"
					>
						{relatedSpaces.map((related) => (
							<SpaceItemRelated space={related} key={related.id} />
						))}
					</Carousel>
				</Grid>
			</Grid>
		</Grid>
	);
}

export default RelatedSpaceComponent;
