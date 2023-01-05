import React, { useCallback, useContext, useEffect, useState } from 'react';
import createStyles from '@mui/styles/createStyles';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import FeedInterface from 'dd-common-blocks/dist/interface/feed.interface';
import { useNavigate } from 'react-router-dom';
import { CommunityFiltersContext } from '@context/community-filters.context';
import { debounce, useDebounce } from '@helpers/debounce.helper';
import { AuthContext } from '@context/auth.context';
import CustomScrollbar from '@shared-components/custom-scrollbar.component';
import checkPermsHelper from '@helpers/checkPerms.helper';
import { Theme } from '@mui/material/styles';
import FeedService from '@service/feed.service';
import CommunityFeedItemComponent from './community-feed-item.component';
import CommentForm, { CommentFormResponse } from './comment-form.component';
import { defaultCommunityRedirect } from '../../../components/mainMenu/main-menu.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		commentFrom: {
			marginBottom: 25,
		},
		scrollArea: {
			height: 'calc(100vh - 145px) !important',
			boxSizing: 'border-box',
			'& > div': {
				paddingBottom: 20,
			},
		},
		textContainer: {
			padding: 15,
			width: '100%',
			margin: 0,
			textAlign: 'center',
			height: '100%',
		},
		loadingWrapper: {
			width: '100%',
		},
		searchField: {
			marginTop: -10,
			marginBottom: 25,
		},
		container: {
			width: '98%',
			marginLeft: '1%',
			'& > .MuiGrid-root': {},
			[theme.breakpoints.down('md')]: {
				maxWidth: '100%',
				width: '100%',
				'& > .MuiGrid-root': {
					paddingLeft: 0,
				},
			},
		},
	})
);

export default function CommunityFeedListComponent() {
	const classes = useStyles({});
	const feedService = new FeedService();
	const navigate = useNavigate();
	const { authBody } = useContext(AuthContext);
	const { communityFilters, setCommunityFilters } = useContext(CommunityFiltersContext);
	const [itemsPerPage] = useState<number>(5);
	const [pageNumber, setPageNumber] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(false);
	const [totalCount, setTotalCount] = useState(0);
	const [error, setError] = useState<Error | undefined>(undefined);
	const [data, setData] = useState<FeedInterface[]>([]);
	const filtersDebounced = useDebounce(communityFilters, 500);
	const [params, setParams] = useState({ ...filtersDebounced, limit: itemsPerPage, offset: itemsPerPage * pageNumber, searchString: '' });

	if (!checkPermsHelper(['Customer Feeds'], ['Feeds'], authBody)) navigate(defaultCommunityRedirect(authBody));

	const loadData = useCallback(async () => {
		if (isLoading) return;
		setIsLoading(true);

		try {
			const [items, count] = await feedService.list(params);
			const newData = [...data, ...items];
			setTotalCount(count);
			setData(newData);
		} catch (e) {
			setError(e as Error);
		} finally {
			setIsLoading(false);
		}
	}, [params]);

	useEffect(() => {
		loadData();
	}, [params]);

	useEffect(() => {
		const newParams = Object.assign(params, filtersDebounced, { limit: itemsPerPage, offset: itemsPerPage * pageNumber });
		if (JSON.stringify(params) !== JSON.stringify(newParams)) {
			newParams.offset = 0;
		}
		setParams({ ...newParams });
	}, [filtersDebounced, itemsPerPage]);

	const addFeed = async (messageData: CommentFormResponse) => {
		if (!authBody) return;
		const sendData: any = { ...messageData, userId: authBody.id, brandId: authBody.brandId };

		if (communityFilters.groupId) {
			sendData.groupId = communityFilters.groupId;
		}

		if (communityFilters.feedCategoryId) {
			sendData.feedCategoryId = communityFilters.feedCategoryId;
		}

		await feedService.save(sendData);
		setData([]);
		setParams({ ...params, offset: 0 });
	};

	const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCommunityFilters({ type: 'searchString', payload: e.target.value });
	};

	const onscroll = debounce(async (e) => {
		if (e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight) {
			if (data.length === totalCount) return;
			if (isLoading) return;
			setPageNumber(pageNumber + 1);
		}
	}, 200);

	return (
		<CustomScrollbar autoHide className={classes.scrollArea} onScroll={onscroll}>
			<Grid container spacing={2} className={classes.container}>
				<Grid item xs={12}>
					<Paper elevation={1} style={{ padding: 25 }}>
						<Grid container spacing={3}>
							<Grid item sm={4} xs={12}>
								<Typography color="inherit" variant="subtitle1" component="div">
									Feeds
								</Typography>
							</Grid>
							<Grid item sm={4} xs={12}>
								{/* {!communityFilters.groupId && (*/}
								{/*	<FeedCategorySelect*/}
								{/*		filters={{ brandId: filtersDebounced.brandId }}*/}
								{/*		onChange={(val) => setCommunityFilters({ type: 'feedCategoryId', payload: val ? val.id : null })}*/}
								{/*	/>*/}
								{/* )}*/}
							</Grid>
							<Grid item sm={4} xs={12}>
								<TextField
									className={classes.searchField}
									placeholder="Search"
									variant="standard"
									onChange={onSearch}
									value={communityFilters.searchString || ''}
								/>
							</Grid>
						</Grid>
					</Paper>

					<Paper elevation={1} className={classes.commentFrom}>
						<CommentForm onSend={addFeed} />
					</Paper>

					{error && (
						<Grid item xs={12} md={12} className={classes.textContainer}>
							<Typography>Error: {error.message}</Typography>
						</Grid>
					)}

					{!error && !isLoading && (!data || !data.length) && (
						<Grid item xs={12} md={12} className={classes.textContainer}>
							<Typography>No Feeds Yet</Typography>
						</Grid>
					)}

					{data && data.map((d) => <CommunityFeedItemComponent key={d.id} feed={d} />)}

					{isLoading && (
						<div className={classes.loadingWrapper}>
							{' '}
							<LinearProgress />
						</div>
					)}
				</Grid>
			</Grid>
		</CustomScrollbar>
	);
}
