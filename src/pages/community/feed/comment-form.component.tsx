import React, { SyntheticEvent, useContext, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import IconButton from '@mui/material/IconButton';
import GifIcon from '@mui/icons-material/Gif';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import ImageEditor from '@shared-components/image-editor.component';
import AvatarComponent from '@shared-components/avatar.component';
import { AuthContext } from '@context/auth.context';
import UploadFileHelper from '@helpers/file-upload.helper';
import useMediaQuery from '@mui/material/useMediaQuery';
import LinksPreviewComponent from './links-preview.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		avatar: {
			width: 100,
			height: 100,
			marginTop: 15,
			marginLeft: 15,
			textDecoration: 'none',
		},

		commentFormWRoot: {
			padding: 15,
		},
		commentFormWrapper: {
			backgroundColor: '#f3f3f3',
			position: 'relative',
			padding: 15,
			paddingBottom: 35,
			'& .emoji-mart-bar': { display: 'none' },
		},
		commentFormField: {
			width: '100%',
			'& .MuiInput-underline:before': {
				display: 'none',
			},
			'& .MuiInput-underline:after': {
				display: 'none',
			},
		},
		commentFormButtons: {
			position: 'absolute',
			right: 15,
			bottom: 0,
		},
		uploadInput: {
			display: 'none',
		},
		emojiVisible: {
			color: theme.palette.primary.main,
		},
		media: {
			height: 0,
			paddingTop: '56.25%', // 16:9
			marginTop: 15,
		},
		deleteMedia: {
			position: 'absolute',
			top: 15,
			right: 15,
		},
	})
);

export interface CommentFormResponse {
	attachment: any;
	uploadAttachments: any[];
	message: string;
}

export default function CommentForm({
	placeholder = 'Start typing a new post here...',
	onSend,
	isFeedForm = true,
}: {
	placeholder?: string;
	onSend: (messageData: any) => void;
	isFeedForm?: boolean;
}) {
	const classes = useStyles({});

	// @ts-ignore
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'), { noSsr: false });

	const inputRef = useRef();
	const [selectionStart, setSelectionStart] = useState(0);
	// @ts-ignore
	const updateSelectionStart = () => setSelectionStart(inputRef.current.selectionStart);

	const { authBody } = useContext(AuthContext);
	const [showEmoji, setShowEmoji] = useState<boolean>(false);
	const [image, setImage] = useState<string>('');
	const [uploadImage, setUploadImage] = useState<string>('');
	const [imageEditVisible, setImageEditVisible] = useState<boolean>(false);

	const [message, setMessage] = useState<string>('');

	const handleImageSave = (base64: string) => {
		setImage(base64);
		setImageEditVisible(false);
	};

	const handleChangeMessage = (e: SyntheticEvent) => {
		const target = e.target as HTMLInputElement;
		const { value } = target;
		setMessage(value);
	};

	const toggleEmoji = () => {
		setShowEmoji(!showEmoji);
	};

	const addEmoji = (e: any) => {
		const start = message.substring(0, selectionStart);
		const end = message.substring(selectionStart, message.length);
		setMessage(`${start} ${e.native} ${end}`);
		setShowEmoji(false);
	};

	const onUploadFile = async (event: any) => {
		const base64: string = await UploadFileHelper(event);
		setUploadImage(base64);
		setImageEditVisible(true);
	};

	const send = () => {
		try {
			onSend({
				uploadAttachments: [image],
				message,
			});
		} catch (e) {
			console.error(e);
		} finally {
			setImage('');
			setMessage('');
		}
	};

	return (
		<Grid container spacing={3} className={classes.commentFormWRoot}>
			<LinksPreviewComponent message={message} />

			{!isMobile && (
				<Grid item xs={12} sm={3} style={{ display: 'flex' }}>
					<AvatarComponent
						size="lg"
						url={`/community/members/${authBody?.id}`}
						src={authBody && authBody.photo ? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${authBody?.photo.url}` : undefined}
						altText={authBody ? `${authBody.firstname} ${authBody.lastname}` : ''}
					/>
				</Grid>
			)}

			<Grid item xs={12} sm={9}>
				<div className={classes.commentFormWrapper}>
					<TextField
						className={classes.commentFormField}
						inputRef={inputRef}
						onSelect={updateSelectionStart}
						onChange={handleChangeMessage}
						value={message}
						multiline
						minRows="4"
						variant="standard"
						placeholder={placeholder}
					/>
					{showEmoji && (
						<Picker
							set="apple"
							style={{
								width: '100%',
								marginBottom: 15,
							}}
							perLine={3}
							onSelect={addEmoji}
							showPreview={false}
						/>
					)}
					<div className={classes.commentFormButtons}>
						{isFeedForm && (
							<IconButton aria-label="add gif" size="large">
								<GifIcon fontSize="small" />
							</IconButton>
						)}

						<IconButton aria-label="add smile" className={showEmoji ? classes.emojiVisible : ''} onClick={toggleEmoji} size="large">
							<InsertEmoticonIcon fontSize="small" />
						</IconButton>
						{isFeedForm && (
							<>
								<input
									accept="image/*"
									className={classes.uploadInput}
									id="contained-button-file"
									type="file"
									onChange={onUploadFile}
								/>
								<label htmlFor="contained-button-file">
									<IconButton color="primary" aria-label="attach picture" component="span" size="large">
										<AttachFileIcon fontSize="small" />
									</IconButton>
								</label>
							</>
						)}

						<Button variant="contained" size="small" color="primary" onClick={send}>
							Send
						</Button>
					</div>
				</div>
			</Grid>

			{image !== '' && (
				<Grid item xs={12} style={{ position: 'relative' }}>
					<Divider />

					<Button color="secondary" className={classes.deleteMedia} startIcon={<CloseIcon fontSize="small" />}>
						Delete attachment
					</Button>

					<CardMedia className={classes.media} title="uploaded image" image={image} />
				</Grid>
			)}

			<Dialog onClose={() => setImageEditVisible(false)} aria-labelledby="simple-dialog-title" open={imageEditVisible}>
				<ImageEditor image={uploadImage} onCancel={() => setImageEditVisible(false)} onSave={handleImageSave} />
			</Dialog>
		</Grid>
	);
}
