import React, { useCallback, useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import CustomScrollbar from '@shared-components/custom-scrollbar.component';
import { axios } from '../../../core/api';

export default function IconPicker() {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [iconsList, setIconsList] = useState<string[]>([]);
	const [iconsListFiltered, setIconsListFiltered] = useState<string[]>([]);

	const [searchString, setSearchString] = useState<string>('');

	const loadIcons = useCallback(async () => {
		const url = '//raw.githubusercontent.com/google/material-design-icons/master/iconfont/codepoints';
		const data: string = await axios.request({ url });

		const dataArr: string[] = data
			.split('\n')
			.map((d) => {
				const p = d.split(' ');
				return p[0];
			})
			.filter((d) => d.length);

		setIconsList(dataArr);
		setIconsListFiltered(dataArr);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		loadIcons();
	}, []);

	useEffect(() => {
		if (searchString.length) {
			setIconsListFiltered(
				iconsList.filter((string: string) => {
					const searches = string.split('_').map((namePiece) => namePiece.search(searchString.toLowerCase()) !== -1);
					return searches.indexOf(true) > -1;
				})
			);
		} else {
			setIconsListFiltered(iconsList);
		}
	}, [searchString]);

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => setSearchString(event.target.value);

	if (isLoading) return <LinearProgress />;

	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<TextField value={searchString} onChange={handleSearch} fullWidth label="Search icon" variant="filled" />
			</Grid>
			<CustomScrollbar autoHide style={{ height: 300 }}>
				<Grid container spacing={4} justifyContent="center">
					{iconsListFiltered.map((icon: string, index: number) => (
						<Grid item xs={2} key={index}>
							<IconButton aria-label="delete" size="large">
								<Icon fontSize="large">{icon}</Icon>
							</IconButton>
						</Grid>
					))}
				</Grid>
			</CustomScrollbar>
		</Grid>
	);
}
