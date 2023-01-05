import React, { memo, useContext, useEffect, useState } from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Typography from '@mui/material/Typography';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RoomIcon from '@mui/icons-material/Room';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import DialogActions from '@mui/material/DialogActions';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import dayjs, { extend } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import FeedInterface from 'dd-common-blocks/dist/interface/feed.interface';
import FeedCommentInterface from 'dd-common-blocks/dist/interface/feed-comment.interface';
import { AuthContext } from '@context/auth.context';
import LinkifyHelper from '@helpers/linkify.helper';
import AvatarComponent from '@shared-components/avatar.component';
import FeedService from '@service/feed.service';
import CommentForm, { CommentFormResponse } from './comment-form.component';
import LinksPreviewComponent from './links-preview.component';
import CommentItemComponent from './comment-item.component';

extend(relativeTime);

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			marginBottom: 15,
		},
		avatar: {
			width: 100,
			height: 100,
			marginTop: 15,
			marginLeft: 15,
			textDecoration: 'none',
		},
		commentsWrapper: {
			backgroundColor: '#f3f3f3',
			padding: 25,
		},
		message: {
			width: '100%',
			padding: 25,
			boxSizing: 'border-box',
			wordBreak: 'break-word',
		},
		iconLike: {
			marginLeft: 'auto',
			color: theme.palette.primary.main,
		},
		iconLiked: {
			marginLeft: 'auto',
			color: theme.palette.secondary.main,
		},
		iconPin: {
			color: theme.palette.primary.main,
		},
		iconPinned: {
			color: theme.palette.secondary.main,
		},
		iconComment: {
			color: theme.palette.primary.main,
		},
		iconPostedTime: {
			color: theme.palette.primary.main,
		},
		iconReport: {
			color: theme.palette.warning.main,
		},
		iconText: {
			marginLeft: 5,
			color: theme.palette.grey.A700,
		},
		locationIcon: {
			color: theme.palette.primary.main,
			fontSize: 20,
			marginBottom: -2,
		},
		media: {
			height: 0,
			paddingTop: '56.25%', // 16:9
		},
	})
);

function CommunityFeedItemComponent({ feed }: { feed: FeedInterface }) {
	const classes = useStyles({});
	const feedService = new FeedService();
	const { authBody, isBrandAdmin, isSuperAdmin } = useContext(AuthContext);
	const [liked, setLiked] = useState<boolean>(feed.likes!.filter((l) => l.userId === authBody?.id).length > 0);
	const [reported, setReported] = useState<boolean>(feed.isReported);
	const [pinned, setPinned] = useState<boolean>(feed.pins!.filter((p) => p.userId === authBody?.id).length > 0);
	const [deleted, setDeleted] = useState<boolean>(false);
	const [message, setMessage] = useState<string>(feed.message);
	const [comments, setComments] = useState<FeedCommentInterface[]>(feed.comments!);
	const [commentsVisible, setCommentsVisible] = useState(false);

	const [dialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		setMessage(LinkifyHelper(feed.message));
	}, []);

	const isUserAdmin = isBrandAdmin || isSuperAdmin;

	if (deleted) return <></>;

	const closeDialog = () => {
		setDialogOpen(false);
	};

	const deleteFeed = async () => {
		await feedService.delete(feed.id);
		setDeleted(true);
		closeDialog();
	};

	const like = async () => {
		if (!authBody) return;
		const clone = feed;
		const likeResp = await feedService.like(feed.id, authBody.id);

		if (!liked) {
			clone.likes!.push(likeResp);
			setLiked(true);
		} else {
			const index = clone.likes!.findIndex((l) => l.userId === authBody?.id);
			clone.likes!.splice(index, 1);
			setLiked(false);
		}
	};

	const report = async () => {
		if (!authBody) return;
		await feedService.report(feed.id, authBody.id);
		if (!reported) {
			setReported(true);
		} else {
			setReported(false);
		}
	};

	const pin = async () => {
		if (!authBody) return;
		await feedService.pin(feed.id, authBody.id);
		if (!pinned) {
			setPinned(true);
		} else {
			setPinned(false);
		}
	};

	const handleCommentsExpand = () => {
		setCommentsVisible(!commentsVisible);
	};

	const leaveComment = async (messageData: CommentFormResponse) => {
		const data = await feedService.comment(feed.id, { ...messageData, comment: messageData.message, userId: authBody?.id });
		setComments([data, ...comments]);
	};

	return (
		<Card className={classes.root} elevation={1}>
			<CardHeader
				avatar={
					<AvatarComponent
						url={`/community/members/${feed.user!.id}`}
						src={feed.user!.photo ? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${feed.user!.photo.url}` : undefined}
						altText={feed.user!.firstname}
					/>
				}
				action={
					<IconButton disableRipple aria-label="time posted" className={classes.iconPostedTime} size="large">
						<AccessTimeIcon />
						<Typography className={classes.iconText}>{dayjs(feed.createdAt).fromNow()}</Typography>
					</IconButton>
				}
				title={
					<Typography variant="body2">
						<b>{`${feed.user!.firstname} ${feed.user!.lastname}`}</b>
					</Typography>
				}
				subheader={
					<Typography component="small" variant="caption">
						<RoomIcon className={classes.locationIcon} /> {feed.user!.brand!.name}
					</Typography>
				}
			/>

			<CardContent>
				<LinksPreviewComponent message={message} />
			</CardContent>

			<CardContent className={classes.message}>
				<Typography dangerouslySetInnerHTML={{ __html: message }} />
			</CardContent>

			{feed.attachments && feed.attachments.length > 0 && (
				<CardMedia
					className={classes.media}
					title={feed.message}
					image={`${process.env.RAZZLE_RUNTIME_MEDIA_URL}${feed.attachments[0].url}`}
				/>
			)}

			<CardActions disableSpacing>
				<IconButton disableRipple aria-label="report" className={classes.iconReport} disabled={reported} onClick={report} size="large">
					<ReportProblemIcon /> <Typography className={classes.iconText}>Report</Typography>
				</IconButton>
				<IconButton disableRipple aria-label="like" className={liked ? classes.iconLiked : classes.iconLike} onClick={like} size="large">
					<FavoriteIcon /> <Typography className={classes.iconText}>{feed.likes!.length}</Typography>
				</IconButton>
				<IconButton disableRipple aria-label="show comments" className={classes.iconComment} onClick={handleCommentsExpand} size="large">
					<ChatBubbleIcon /> <Typography className={classes.iconText}>{comments.length}</Typography>
				</IconButton>
				{isUserAdmin && (
					<IconButton disableRipple aria-label="pin post" className={pinned ? classes.iconPinned : classes.iconPin} onClick={pin} size="large">
						<BookmarkIcon />
					</IconButton>
				)}
				{(isUserAdmin || authBody?.id === feed.userId) && (
					<IconButton disableRipple aria-label="delete feed" className={classes.iconPin} onClick={() => setDialogOpen(true)} size="large">
						<DeleteIcon />
					</IconButton>
				)}
			</CardActions>

			<Collapse in={commentsVisible} timeout="auto" unmountOnExit>
				<Divider style={{ height: 2 }} />
				<CardContent>
					<CommentForm placeholder="Start typing your comment here..." onSend={leaveComment} isFeedForm={false} />
				</CardContent>

				<Divider style={{ height: 2 }} />
				<CardContent className={classes.commentsWrapper}>
					{comments.map((c, k) => (
						<CommentItemComponent key={k} comment={c} />
					))}
				</CardContent>
			</Collapse>
			<Dialog open={dialogOpen} onClose={closeDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
				<DialogActions>
					<Button onClick={closeDialog} color="primary">
						Cancel
					</Button>
					<Button onClick={deleteFeed} color="primary" autoFocus>
						Ok
					</Button>
				</DialogActions>
			</Dialog>
		</Card>
	);
}

export default memo(CommunityFeedItemComponent);
