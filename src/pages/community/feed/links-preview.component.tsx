import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import LinearProgress from '@mui/material/LinearProgress';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LinkPreviewInterface from 'dd-common-blocks/dist/interface/custom/link-preview.interface';
import VideoComponent, { isVideoUrl } from '@shared-components/video.component';
import BaseService from '@service/base.service';

const useStyles = makeStyles(() =>
	createStyles({
		linkData_listItem: {
			borderBottom: '1px solid #d2d2d2',
		},
		linkData_list: {
			borderTop: '1px solid #d2d2d2',
			padding: 0,
			width: '100%',
		},
		linkData_avatar: {
			width: 150,
			borderRadius: 0,
			height: 100,
			marginRight: 15,
		},
	})
);

export default function LinksPreviewComponent({ message }: { message: string }) {
	const classes = useStyles({});
	const baseService = new BaseService();
	const theme = useTheme();
	const [loadingPreview, setLoadingPreview] = useState<boolean>(false);
	const [linksData, setLinksData] = useState<LinkPreviewInterface[]>([]);

	const [messageHaveUrls, setMessageHaveUrls] = useState<null | string[]>(null);
	const [currentLinkData, setCurrentLinkData] = useState<LinkPreviewInterface>();
	const [videoVisible, setVideoVisible] = useState(false);
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

	const onLinkDataClick = (linkData: LinkPreviewInterface) => {
		if (isVideoUrl(linkData.url)) {
			setCurrentLinkData(linkData);
			setVideoVisible(true);
		} else {
			window.open(linkData.url, '_blank');
		}
	};

	const handleClose = () => {
		setVideoVisible(false);
	};

	useEffect(() => {
		setMessageHaveUrls(message.match(/(https?:\/\/[^\s]+)/g));

		if (messageHaveUrls) {
			setLoadingPreview(true);
			Promise.all(messageHaveUrls.map(async (url) => baseService.linkPreview(url))).then((resps) => {
				// @ts-ignore
				setLinksData(resps);
				setLoadingPreview(false);
			});
		}
	}, [message]);

	if (!messageHaveUrls) return <></>;
	if (loadingPreview) return <LinearProgress style={{ width: '100%' }} />;

	return (
		<>
			<List className={classes.linkData_list}>
				{linksData.map((urlData: LinkPreviewInterface, k: number) => (
					<ListItem key={k} button onClick={() => onLinkDataClick(urlData)} href={urlData.url} className={classes.linkData_listItem}>
						{urlData.images && urlData.images.length && (
							<ListItemAvatar>
								<Avatar className={classes.linkData_avatar} src={urlData.images[0]} alt={urlData.title} />
							</ListItemAvatar>
						)}
						<ListItemText
							primary={<Typography variant="body1">{urlData.title}</Typography>}
							secondary={<Typography variant="caption">{urlData.description}</Typography>}
						/>
					</ListItem>
				))}
			</List>
			<Dialog fullScreen={fullScreen} open={videoVisible} onClose={handleClose}>
				<DialogTitle>{currentLinkData ? currentLinkData.title : ''}</DialogTitle>
				<DialogContent style={{ padding: 0 }}>
					<VideoComponent videoUrl={typeof currentLinkData !== 'undefined' ? currentLinkData.url : ''} />
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary" autoFocus>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
