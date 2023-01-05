import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import { common } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import { Link, useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import { AuthContext } from '@context/auth.context';
import { useDebounce } from '@helpers/debounce.helper';
import ImageEditor from '@shared-components/image-editor.component';
import { SnackBarContext } from '@context/snack-bar.context';
import UploadFileHelper from '@helpers/file-upload.helper';
import UserService from '@service/user.service';
import CompanyService from '@service/company.service';
import GroupService from '@service/group.service';

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
			[theme.breakpoints.down('md')]: {
				width: '100%',
				position: 'relative',
				right: 'auto',
			},
		},
	})
);

export default function GroupCompanyCreateComponent({ type }: { type: 'company' | 'group' }) {
	const classes = useStyles({});
	const userService = new UserService();
	const companyService = new CompanyService();
	const groupService = new GroupService();
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const { authBody, isSuperAdmin, isBrandAdmin } = useContext(AuthContext);
	const { showSnackBar } = useContext(SnackBarContext);

	const navigate = useNavigate();
	const [image, setImage] = useState<string>('');
	const [uploadImage, setUploadImage] = useState<string>('');
	const [imageEditVisible, setImageEditVisible] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [members, setMembers] = useState<UserInterface[]>([]);
	const [membersFiltered, setMembersFiltered] = useState<UserInterface[]>([]);
	const [membersSearch, setMembersSearch] = useState<string>('');
	const [membersSelectVisible, setMembersSelectVisible] = useState<boolean>(false);
	const membersSearchDebounced = useDebounce(membersSearch, 100);
	const [createVisible, setCreateVisible] = useState(false);

	const handleToggleCreate = () => {
		setCreateVisible(!createVisible);
	};

	const loadUsers = useCallback(
		async (inputName: string) => {
			setIsLoading(true);
			try {
				const [data] = await userService.list({
					brandId: !isSuperAdmin ? String(authBody?.brandId) : undefined,
					withSubscriptions: false,
					searchString: inputName,
				});
				setMembersFiltered(data);
			} catch (e) {
				console.error(e);
			} finally {
				setIsLoading(false);
			}
		},
		[membersFiltered, membersSearch]
	);

	const handleCreate = async () => {
		if (!authBody) return;
		try {
			const data: any = {
				image,
				createdById: authBody.id,
				members: members.map((m) => m.id),
				description,
				name,
				brandId: authBody.brandId,
				userId: authBody.id,
			};

			if (uploadImage) {
				data.uploadAttachments = [uploadImage];
			}

			if (type === 'group') {
				const newGroup = await groupService.save(data);
				navigate(`${isSuperAdmin || isBrandAdmin ? '/dashboard' : ''}/community/groups/${newGroup.id}`);
			} else {
				const newCompany = await companyService.save(data);
				navigate(`${isSuperAdmin || isBrandAdmin ? '/dashboard' : ''}/community/companies/${newCompany.id}`);
			}
			handleToggleCreate();
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		}
	};

	useEffect(() => {
		loadUsers(membersSearchDebounced).then();
	}, [membersSearchDebounced]);

	const handleClose = () => {
		setCreateVisible(false);
	};

	const handleName = (e: any) => {
		setName(e.target.value);
	};

	const handleDescription = (e: any) => {
		setDescription(e.target.value);
	};

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

	return (
		<>
			<Button className={classes.addBtn} onClick={handleToggleCreate} startIcon={<AddCircleIcon />} variant="outlined" color="primary">
				Create new {type}
			</Button>

			<Dialog onClose={handleClose} open={createVisible} maxWidth="sm">
				<Grid container spacing={3} style={{ padding: 35, width: '100%', margin: 0 }}>
					<Grid item xs={12} sm={12}>
						<DialogTitle className={classes.title}>Create new {type}</DialogTitle>
						<IconButton aria-label="close" className={classes.closeBtn} onClick={handleClose} size="large">
							<CloseIcon />
						</IconButton>
					</Grid>

					<Grid item xs={12} sm={9}>
						<TextField autoFocus margin="dense" id="name" label="Name" type="text" fullWidth value={name} onChange={handleName} />
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
							id="description"
							label="Description"
							type="text"
							minRows={4}
							multiline
							fullWidth
							value={description}
							onChange={handleDescription}
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
						<Button fullWidth variant="contained" color="primary" onClick={handleCreate}>
							Save
						</Button>
					</Grid>
				</Grid>
			</Dialog>

			<Dialog onClose={() => setImageEditVisible(false)} open={imageEditVisible}>
				<ImageEditor image={uploadImage} aspectRatio={1} onCancel={() => setImageEditVisible(false)} onSave={handleImageSave} />
			</Dialog>

			<Dialog onClose={() => setMembersSelectVisible(false)} open={membersSelectVisible} maxWidth="xs" fullWidth>
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

					<Grid item xs={12} sm={12} style={{ height: 330 }}>
						{isLoading && <LinearProgress />}

						{!isLoading && (
							<>
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
							</>
						)}
					</Grid>
				</Grid>
			</Dialog>
		</>
	);
}
