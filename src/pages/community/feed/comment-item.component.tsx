import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';
import ListItemText from '@mui/material/ListItemText';
import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import RoomIcon from '@mui/icons-material/Room';
import Typography from '@mui/material/Typography';
import dayjs, { extend } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import makeStyles from '@mui/styles/makeStyles';
import FeedCommentInterface from 'dd-common-blocks/dist/interface/feed-comment.interface';

extend(relativeTime);

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		commentAvatar: {
			width: 70,
			height: 70,
			marginRight: 25,
			textDecoration: 'none',
		},
		commentBrand: {
			marginLeft: 45,
		},
		commentBrandIcon: {
			fontSize: 20,
			marginBottom: -2,
			color: theme.palette.primary.main,
		},
		commentCreatedAt: {
			position: 'absolute',
			right: 15,
			top: 15,
			fontSize: 15,
			color: theme.palette.grey.A700,
		},
		commentComment: {
			wordBreak: 'break-word',
		},
	})
);

export default function CommentItemComponent({ comment }: { comment: FeedCommentInterface }) {
	const classes = useStyles({});
	return (
		<ListItem>
			<ListItemAvatar>
				<Avatar
					component={Link}
					to={`/community/members/${comment.__user__!.id}`}
					alt={`${comment.__user__!.firstname} ${comment.__user__!.lastname}`}
					className={classes.commentAvatar}
					src={comment.__user__!.photo ? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${comment.__user__!.photo.url}` : undefined}
				>
					{comment.__user__!.username.substring(0, 2)}
				</Avatar>
			</ListItemAvatar>
			<ListItemText
				primary={
					<Typography variant="body2">
						{`${comment.__user__!.firstname} ${comment.__user__!.lastname}`}
						<Typography className={classes.commentBrand} variant="caption">
							<RoomIcon className={classes.commentBrandIcon} /> {comment.__user__!.brand!.name}
						</Typography>
						<Typography component="span" className={classes.commentCreatedAt}>
							{dayjs(comment.createdAt).fromNow()}
						</Typography>
					</Typography>
				}
				secondary={<Typography className={classes.commentComment}>{comment.comment}</Typography>}
			/>
		</ListItem>
	);
}
