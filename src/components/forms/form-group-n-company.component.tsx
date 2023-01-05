import React, { useCallback, useContext, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';
import { Link } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { common } from '@mui/material/colors';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import { SnackBarContext } from '@context/snack-bar.context';
import ImageEditor from '@shared-components/image-editor.component';
import { useDebounce } from '@helpers/debounce.helper';
import UploadFileHelper from '@helpers/file-upload.helper';
import UserService from '@service/user.service';

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
		memberListItem: {
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

export default function FormGroupNCompanyComponent({
	onSuccess,
	type,
	brandId,
}: {
	onSuccess: (resp: { name: string; about: string; image: string; members: number[] }) => void;
	type: 'company' | 'group';
	brandId?: null;
}) {
	const classes = useStyles({});
	const userService = new UserService();

	const { showSnackBar } = useContext(SnackBarContext);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const [image, setImage] = useState<string>('');
	const [uploadImage, setUploadImage] = useState<string>('');
	const [imageEditVisible, setImageEditVisible] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [members, setMembers] = useState<UserInterface[]>([]);
	const [membersLoaded, setMembersLoaded] = useState<UserInterface[]>([]);
	const [membersFiltered, setMembersFiltered] = useState<UserInterface[]>([]);
	const [membersSearch, setMembersSearch] = useState<string>('');
	const [membersSelectVisible, setMembersSelectVisible] = useState<boolean>(false);
	const membersSearchDebounced = useDebounce(membersSearch, 100);

	const loadUsers = useCallback(async () => {
		setIsLoading(true);
		try {
			const [data] = await userService.list({ brandId: brandId || undefined, limit: 501, withSubscriptions: false });
			setMembersFiltered(data);
			setMembersLoaded(data);
		} catch (e) {
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	}, [membersFiltered]);

	useEffect(() => {
		setMembersFiltered(
			membersLoaded.filter((m: UserInterface) => {
				const { firstname, lastname } = m;
				if (!firstname && !lastname) return false;

				if (firstname && firstname.toLowerCase().search(membersSearchDebounced.toLowerCase()) !== -1) return true;

				return lastname && lastname.toLowerCase().search(membersSearchDebounced.toLowerCase()) !== -1;
			})
		);
	}, [membersSearchDebounced]);

	useEffect(() => {
		loadUsers().then();
	}, []);

	const onUploadFile = async (event: any) => {
		const base64: string = await UploadFileHelper(event);
		setUploadImage(base64);
		setImageEditVisible(true);
	};

	const handleImageSave = (base64: string) => {
		setImage(base64);
		setImageEditVisible(false);
	};

	const handleSearchMembers = (e: any) => {
		setMembersSearch(e.target.value);
	};

	const isMemberSelected = (userId: number) => members.findIndex((m) => m.id === userId) !== -1;

	const handleToggleMember = (user: UserInterface) => {
		if (isMemberSelected(user.id!)) {
			setMembers([...members.filter((m) => m.id !== user.id)]);
		} else {
			setMembers([user, ...members]);
		}
	};

	const onSubmit = async (formData: any) => {
		try {
			onSuccess({
				...formData,
				members: members.map((m) => m.id),
				image,
			});
		} catch (e) {
			showSnackBar((e as Error).message);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Grid container spacing={3} style={{ padding: 35, width: '100%', margin: 0 }}>
					<Grid item xs={12} sm={12}>
						<DialogTitle className={classes.title}>Create new {type}</DialogTitle>
					</Grid>

					<Grid item xs={12} md={9}>
						<TextField
							autoFocus
							error={!!errors.name}
							margin="dense"
							label="Name"
							type="text"
							fullWidth
							helperText={errors.name ? errors.name.message : ''}
							{...register('name', {
								required: 'Field is required',
							})}
						/>
					</Grid>

					<Grid item xs={12} sm={3}>
						<input accept="image/*" className={classes.uploadInput} id="new-item-avatar" type="file" onChange={onUploadFile} />
						<label htmlFor="new-item-avatar" style={{ display: 'block' }}>
							{!image && (
								<IconButton className={classes.avatar} component="span" size="large">
									<>
										<AddIcon />
										<Typography>Add photo</Typography>
									</>
								</IconButton>
							)}
							{image && <Avatar src={image} className={classes.avatar} />}
						</label>
					</Grid>

					<Grid item xs={12} style={{ marginTop: -50 }}>
						<TextField
							margin="dense"
							helperText={errors.about ? errors.about.message : ''}
							label="Description"
							error={!!errors.about}
							type="text"
							minRows={4}
							multiline
							{...register('about', {
								required: 'Field is required',
							})}
							fullWidth
						/>
					</Grid>

					<Grid item xs={12}>
						{isLoading && <LinearProgress />}

						{!isLoading && (
							<>
								<Typography variant="body1" style={{ paddingBottom: 15 }}>
									Members
								</Typography>

								<div className={classes.membersWrapper}>
									<IconButton className={classes.addMember} onClick={() => setMembersSelectVisible(true)} size="large">
										<AddIcon />
									</IconButton>

									{members.map((m) => (
										<Avatar
											key={m.id}
											component={Link}
											target="_blank"
											to={`/community/members/${m.id}`}
											src={m.photo ? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${m.photo.url}` : ''}
											alt={`${m.firstname} ${m.lastname}`}
										>
											{m.firstname.substring(0, 2)}
										</Avatar>
									))}
								</div>
							</>
						)}
					</Grid>

					<Grid item xs={12}>
						<Button fullWidth variant="contained" color="primary" type="submit">
							Save
						</Button>
					</Grid>
				</Grid>
			</form>

			<Dialog onClose={() => setImageEditVisible(false)} open={imageEditVisible}>
				<ImageEditor image={uploadImage} aspectRatio={1} onCancel={() => setImageEditVisible(false)} onSave={handleImageSave} />
			</Dialog>

			<Dialog onClose={() => setMembersSelectVisible(false)} open={membersSelectVisible}>
				<Grid container spacing={3} style={{ padding: '15px 15% 0px', width: '100%' }}>
					<Grid item xs={12} sm={12} style={{ padding: '0 15%' }}>
						<TextField
							autoFocus
							margin="dense"
							id="search"
							label="Search user"
							type="text"
							fullWidth
							value={membersSearch}
							onChange={handleSearchMembers}
						/>
						<IconButton
							aria-label="close"
							className={classes.closeBtn}
							color="primary"
							onClick={() => setMembersSelectVisible(false)}
							size="large"
						>
							<CloseIcon />
						</IconButton>
					</Grid>

					<Grid item xs={12} sm={12}>
						{membersFiltered.length === 0 && <Typography>No users matching search criteria</Typography>}

						<List>
							{membersFiltered.map((m) => (
								<div key={m.id}>
									<ListItem
										button
										onClick={() => handleToggleMember(m)}
										className={isMemberSelected(m.id!) ? classes.memberSelected : classes.memberListItem}
									>
										<Avatar
											key={m.id}
											component={Link}
											style={{ textDecoration: 'none', marginRight: 15 }}
											target="_blank"
											to={`/community/members/${m.id}`}
											src={m.photo ? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${m.photo.url}` : ''}
											alt={`${m.firstname} ${m.lastname}`}
										>
											{m.firstname.substring(0, 2)}
										</Avatar>
										<Typography>{`${m.firstname} ${m.lastname}`}</Typography>
									</ListItem>
									<Divider style={{ width: '100%' }} />
								</div>
							))}
						</List>
					</Grid>
				</Grid>
			</Dialog>
		</>
	);
}
