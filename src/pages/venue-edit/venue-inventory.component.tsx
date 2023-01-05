import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import { Helmet } from 'react-helmet';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import VenueInterface from 'dd-common-blocks/dist/interface/venue.interface';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import { debounce } from '@helpers/debounce.helper';
import SpaceService from '@service/space.service';
import { siteTitleHelper } from '@helpers/site-title.helper';
import { siteDescriptionHelper } from '@helpers/site-description.helper';
import FormVenueInventoryComponent from '@forms/form-venue-inventory.component';
import CustomScrollbar from '@shared-components/custom-scrollbar.component';
import VenuePackageItem from './venue-package-item.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		noItems: {
			textAlign: 'center',
		},
		itemsWrap: {
			padding: 35,
			[theme.breakpoints.down('md')]: {
				padding: 0,
				margin: 0,
				width: '100%',
			},
		},
		spaces: {
			height: '100vh !important',
			[theme.breakpoints.down('md')]: {},
		},
		spacesContainerItem: {
			[theme.breakpoints.down('md')]: {
				padding: '0 !important',
			},
			'& > .MuiPaper-root': {
				borderRadius: 0,
			},
		},
		textContainer: {
			padding: 15,
			width: '100%',
			margin: 0,
			textAlign: 'center',
			// height: '100%',
		},
		title: {
			paddingTop: 15,
			textAlign: 'center',
		},
		spacesContainer: {
			padding: 15,
			width: '100%',
			margin: 0,
			[theme.breakpoints.down('md')]: {
				padding: 0,
			},
		},
		filterWrap: {
			[theme.breakpoints.down('md')]: {
				margin: '12px !important',
				borderBottom: '1px solid #d5d5d5',
			},
		},
	})
);

export default function VenueInventoryComponent({ venueData }: { venueData?: VenueInterface | undefined }) {
	const classes = useStyles({});
	const spaceService = new SpaceService();

	const { venueId } = useParams();

	const limit = 6;

	const [data, setData] = useState<SpaceInterface[]>([]);
	const [loadedItemsCount, setLoadedItemsCount] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [pageNumber, setPageNumber] = useState<number>(0);
	const [totalCount, setTotalCount] = useState(0);
	const [error, setError] = useState<Error | undefined>(undefined);
	const [params, setParams] = useState({ venueId: venueData?.id, limit, offset: pageNumber * limit });

	const loadSpaces = useCallback(async () => {
		if (isLoading) return;
		setIsLoading(true);
		try {
			const [items, total] = await spaceService.list({ ...params, withCreatedBy: true, venueStatus: venueData?.status });

			if (params.offset === 0) {
				setData(items);
				setLoadedItemsCount(items.length);
			} else {
				const newData = [...data, ...items];
				setLoadedItemsCount(loadedItemsCount + items.length);
				setData(newData);
			}
			setTotalCount(total);
		} catch (e) {
			setError(e as Error);
		} finally {
			setIsLoading(false);
		}
	}, [params]);

	useEffect(() => {
		if (venueId !== '0') {
			loadSpaces();
		}
	}, [params]);

	useEffect(() => {
		const newParams = Object.assign(params, { limit, offset: limit * pageNumber });

		if (JSON.stringify(params) !== JSON.stringify(newParams)) {
			newParams.offset = 0;
		}
		setParams({ ...newParams });
	}, [pageNumber]);

	const handleSearch = (formData: any) => {
		setPageNumber(0);
		if (formData.spaceTypeId === 0)
			// eslint-disable-next-line no-param-reassign
			delete formData.spaceTypeId;

		setParams({ ...params, ...formData });
	};

	const onscroll = debounce(async (e) => {
		if (e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight) {
			if (data.length === totalCount) return;
			if (isLoading) return;
			setPageNumber(pageNumber + 1);
		}
	}, 200);

	return (
		<Paper>
			<Grid container spacing={3} className={classes.itemsWrap}>
				<Grid item xs={12} className={classes.filterWrap}>
					<FormVenueInventoryComponent onSearch={handleSearch} />
				</Grid>

				<CustomScrollbar autoHide className={classes.spaces} onScroll={onscroll}>
					{error && (
						<Grid item xs={12} md={12} className={classes.textContainer}>
							<Typography>Error: {error.message}</Typography>
						</Grid>
					)}

					{!error && !isLoading && (!data || !data.length) && (
						<Grid item xs={12} md={12} className={classes.textContainer}>
							<Typography>No packages found</Typography>
						</Grid>
					)}

					{data && (
						<>
							{loadedItemsCount > 0 && (
								<>
									<Helmet>
										<title>{siteTitleHelper(`${loadedItemsCount} of ${totalCount} spaces`)}</title>
										<meta name="description" content={siteDescriptionHelper(`${loadedItemsCount} of ${totalCount} spaces`)} />
									</Helmet>
									<Typography className={classes.title}>
										Showing 1-
										{loadedItemsCount} of {totalCount} spaces
									</Typography>
								</>
							)}
							<Grid container spacing={2} className={classes.spacesContainer}>
								{data.map((space: any, index: number) => (
									<Grid item xs={12} md={6} xl={6} key={index} className={classes.spacesContainerItem}>
										<VenuePackageItem space={space} />
									</Grid>
								))}
							</Grid>
						</>
					)}
					{isLoading && <LinearProgress />}
				</CustomScrollbar>
			</Grid>
		</Paper>
	);
}
