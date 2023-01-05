import React, { ChangeEvent, useState, useCallback, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import FeedCategoryInterface from 'dd-common-blocks/dist/interface/feed-category.interface';
import FeedCategoryService from '@service/feed-category.service';

const useStyles = makeStyles((theme) =>
	createStyles({
		root: {},
		expandIcon: {
			color: theme.palette.primary.main,
		},
		input: {},
		option: {},
		optionIcon: {},
	})
);

interface Props {
	onChange: (i: FeedCategoryInterface | null) => any;
	defaultValue?: number | null;
	filters?: { brandId: number };
}

export default function ({ filters, onChange, defaultValue = null }: Props) {
	const classes = useStyles({});
	const feedCatService = new FeedCategoryService();
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState<FeedCategoryInterface[]>([]);
	const [value, setValue] = useState<FeedCategoryInterface>();

	const loadData = useCallback(async () => {
		setIsLoading(true);
		try {
			const [items] = await feedCatService.list({
				...filters,
			});
			if (items) {
				let newItems = items;
				// Re-rendering fix
				const allIndex = data.findIndex((i: FeedCategoryInterface) => i.id === null);
				if (allIndex === -1) {
					newItems = [
						{
							name: 'All Categories',
							id: 0,
							brandId: 0,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
						...items,
					];
				}

				setData(newItems);

				setValue(newItems.find((st: FeedCategoryInterface) => defaultValue === st.id));
			}
		} catch (e) {
			console.error(e as Error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const handleSpaceTypeChange = (e: ChangeEvent<any>, inputVal: FeedCategoryInterface | null) => {
		setValue(inputVal ? inputVal : undefined);
		onChange(inputVal);
	};

	if (isLoading) return <CircularProgress style={{ margin: '10px auto', display: 'block' }} />;

	useEffect(() => {
		loadData().then();
	}, []);

	return (
		<Autocomplete
			options={data}
			classes={{
				root: classes.root,
				option: classes.option,
			}}
			getOptionLabel={(option) => option.name}
			autoComplete
			value={value}
			includeInputInList
			onChange={handleSpaceTypeChange}
			renderOption={(props, option) => (
				<li {...props}>
					<Typography variant="caption" style={{ fontSize: 13 }}>
						{option.name}
					</Typography>
				</li>
			)}
			renderInput={(params) => (
				<TextField
					{...params}
					className={classes.input}
					placeholder="All Categories"
					fullWidth
					inputProps={{
						...params.inputProps,
						autoComplete: 'disabled', // disable autocomplete and autofill
					}}
				/>
			)}
		/>
	);
}
