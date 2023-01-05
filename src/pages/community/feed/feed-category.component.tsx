import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import { common } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AppsIcon from '@mui/icons-material/Apps';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import FeedCategoryInterface from 'dd-common-blocks/dist/interface/feed-category.interface';
import { AuthContext } from '@context/auth.context';
import { useDebounce } from '@helpers/debounce.helper';
import { SnackBarContext } from '@context/snack-bar.context';
import FeedCategoryService from '@service/feed-category.service';
import AutocompleteAsync from '@forms/elements/autocomplete-async.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		title: {
			// padding: 15,
			color: theme.palette.primary.main,
			textAlign: 'center',
			fontWeight: 500,
			position: 'relative',
		},
		closeBtn: {
			position: 'absolute',
			top: 15,
			right: 15,
		},
		avatar: {
			border: '1px solid gray',
			color: theme.palette.primary.main,
			backgroundColor: common.white,
			width: 90,
			height: 90,
			cursor: 'pointer',
			'& p': {
				fontSize: 12,
			},
			'& .MuiIconButton-label': {
				flexDirection: 'column',
			},
		},
		addMember: {
			borderWidth: 1,
			borderStyle: 'solid',
			borderColor: theme.palette.primary.main,
			color: theme.palette.primary.main,
			backgroundColor: common.white,
			width: 40,
			height: 40,
			flexDirection: 'column',
		},
		uploadInput: {
			display: 'none',
		},
		membersWrapper: {
			display: 'flex',
			flexWrap: 'wrap',
			'& button': {
				marginRight: 10,
			},
			'& a': {
				marginRight: 10,
				marginBottom: 10,
				textDecoration: 'none',
			},
		},
		memberSelected: {
			backgroundColor: 'gray',
			'& p': {
				color: 'white',
			},
			'&:hover': {
				backgroundColor: 'gray',
				'& p': {
					color: 'white',
				},
			},
		},
		addBtn: {
			position: 'absolute',
			top: 15,
			right: 10,
		},
	})
);

export default function FeedCategoryComponent() {
	const classes = useStyles({});

	const feedCatService = new FeedCategoryService();
	const [data, setData] = useState<FeedCategoryInterface[]>([]);

	const [name, setName] = useState('');
	const { authBody, isSuperAdmin, isBrandAdmin } = useContext(AuthContext);
	const [brand, setBrand] = useState<number | undefined>(isSuperAdmin ? undefined : authBody?.brandId);
	const { showSnackBar } = useContext(SnackBarContext);

	const [editingCategory, setEditingCategory] = useState<FeedCategoryInterface>();
	const [deletingCategory, setDeletingCategory] = useState<FeedCategoryInterface>();
	const [categoriesFiltered, setCategoriesFiltered] = useState<FeedCategoryInterface[]>([]);
	const [categorySearch, setCategorySearch] = useState<string>('');
	const categorySearchDebounced = useDebounce(categorySearch, 100);

	const apiParams: { limit: number; brandId?: number } = { limit: 500 };
	if (isBrandAdmin && authBody) apiParams.brandId = authBody.brandId;

	const [createVisible, setCreateVisible] = useState(false);

	const loadData = useCallback(async () => {
		try {
			const [items] = await feedCatService.list(apiParams);
			if (items) {
				setData(items);
				setCategoriesFiltered(items);
			}
		} catch (e) {
			console.error(e as Error);
		}
	}, [apiParams]);

	useEffect(() => {
		loadData().then();
	}, []);

	const handleToggleCreate = () => {
		setCreateVisible(!createVisible);
	};

	const handleCreate = async () => {
		if (!authBody) return;
		try {
			const newData = {
				name,
				brandId: brand || authBody?.brandId,
				userId: authBody.id,
			};

			await feedCatService.save(newData, editingCategory?.id);
			await loadData();
			setName('');
			setBrand(isSuperAdmin ? undefined : authBody.brandId);
			setEditingCategory(undefined);
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		}
	};

	useEffect(() => {
		setCategoriesFiltered(data.filter((m: FeedCategoryInterface) => m.name.toLowerCase().search(categorySearchDebounced.toLowerCase()) !== -1));
	}, [categorySearchDebounced]);

	const handleClose = () => {
		setCreateVisible(false);
	};

	const handleName = (e: any) => {
		setName(e.target.value);
	};

	const handleBrand = (brandId: number | null) => {
		setBrand(brandId === null ? undefined : brandId);
	};

	const handleSearchCategory = (e: any) => {
		setCategorySearch(e.target.value);
	};

	const handleSelectCategory = async (c: FeedCategoryInterface) => {
		setEditingCategory(c);
		setBrand(c.brandId);
		setName(c.name);
	};

	const closeDialog = () => {
		setDeletingCategory(undefined);
	};

	const dialogAgree = async () => {
		if (deletingCategory) await feedCatService.delete(deletingCategory.id);
		setDeletingCategory(undefined);
		await loadData();
	};

	const showDialog = (c: FeedCategoryInterface) => {
		setDeletingCategory(c);
	};

	return (
		<>
			<Button className={classes.addBtn} onClick={handleToggleCreate} startIcon={<AppsIcon />} variant="outlined" color="primary">
				Feed category
			</Button>

			<Dialog onClose={handleClose} open={createVisible} maxWidth="sm">
				<Grid container spacing={3} style={{ padding: 35, width: '100%', margin: 0 }}>
					<Grid item xs={12} sm={12}>
						<DialogTitle className={classes.title}>{editingCategory ? 'Edit' : 'Create new'} feed category</DialogTitle>
						<IconButton aria-label="close" className={classes.closeBtn} onClick={handleClose} size="large">
							<CloseIcon />
						</IconButton>
					</Grid>

					<Grid item xs={12}>
						<TextField autoFocus margin="dense" id="name" label="Name" type="text" fullWidth value={name} onChange={handleName} />
					</Grid>

					<Grid item xs={12}>
						<AutocompleteAsync
							type="brand"
							label="Brand"
							variant="standard"
							showAll
							filter={{}}
							showLabel={false}
							defaultValue={Number(brand)}
							onChange={handleBrand}
						/>
					</Grid>

					<Grid item xs={12}>
						<Button fullWidth variant="contained" color="primary" onClick={handleCreate}>
							Save
						</Button>
					</Grid>
				</Grid>

				<Grid container spacing={3} style={{ padding: '15px 15% 0px', width: '100%' }}>
					<Grid item xs={12} sm={12} style={{ padding: '0 15%' }}>
						<TextField
							autoFocus
							margin="dense"
							id="search"
							label="Search category"
							type="text"
							fullWidth
							value={categorySearch}
							onChange={handleSearchCategory}
						/>
					</Grid>

					<Grid item xs={12} sm={12}>
						{categoriesFiltered.length === 0 && <Typography>No categories matching search criteria</Typography>}

						<List>
							{categoriesFiltered.map((c) => (
								<div key={c.id}>
									<ListItem>
										<ListItemText primary={c.name} secondary={c.brand ? c.brand.name : ''} />
										<ListItemSecondaryAction>
											<IconButton onClick={() => handleSelectCategory(c)} aria-label="edit" color="primary" size="large">
												<EditIcon />
											</IconButton>
											<IconButton aria-label="delete" color="secondary" onClick={() => showDialog(c)} size="large">
												<DeleteIcon />
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
									<Divider style={{ width: '100%' }} />
								</div>
							))}
						</List>
					</Grid>
				</Grid>
			</Dialog>

			<Dialog
				open={typeof deletingCategory !== 'undefined'}
				onClose={closeDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle>Are you sure you want to delete category &apos;{deletingCategory ? deletingCategory.name : ''}&apos;?</DialogTitle>
				<DialogActions>
					<Button onClick={closeDialog} color="primary">
						Cancel
					</Button>
					<Button onClick={dialogAgree} color="primary" autoFocus>
						Ok
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
