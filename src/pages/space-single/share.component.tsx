import React, { useState } from 'react';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton, EmailShareButton } from 'react-share';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ShareIcon from '@mui/icons-material/Share';
import MailIcon from '@mui/icons-material/Mail';
import Button from '@mui/material/Button';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import Popover from '@mui/material/Popover';
import { useLocation } from 'react-router-dom';
import { APP_DOMAIN } from '@core/config';
import ShareStyle from './style/share.style';

interface ShareComponentProps {
	space: SpaceInterface;
}

function ShareIcons({ space }: ShareComponentProps) {
	const { pathname, search, hash } = useLocation();
	const classes = ShareStyle();

	const url = `https://${APP_DOMAIN}${[pathname, search, hash].toString()}`;

	return (
		<>
			<FacebookShareButton
				url={url}
				quote={`${space.name} - Dropdesk`}
				hashtag="#dropdesk"
				openShareDialogOnClick
				className={classes.spaceShareMobileTextIcon}
			>
				<FacebookIcon />
			</FacebookShareButton>

			<TwitterShareButton url={url} title={`${space.name} - Dropdesk`} openShareDialogOnClick className={classes.spaceShareMobileTextIcon}>
				<TwitterIcon />
			</TwitterShareButton>

			<LinkedinShareButton
				url={url}
				source="Dropdesk"
				openShareDialogOnClick
				title={`${space.name} - Dropdesk`}
				className={classes.spaceShareMobileTextIcon}
			>
				<LinkedInIcon />
			</LinkedinShareButton>

			<EmailShareButton
				url={url}
				subject="Bridgeworks Package info"
				body={url}
				openShareDialogOnClick
				className={classes.spaceShareMobileTextIcon}
			>
				<MailIcon />
			</EmailShareButton>
		</>
	);
}
export default function ShareComponent({ space }: ShareComponentProps) {
	const classes = ShareStyle();
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	return (
		<>
			<Button className={classes.shareBtn} onClick={handleClick}>
				<ShareIcon />
				Share
			</Button>

			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				className={classes.spaceShare}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
			>
				<ShareIcons space={space} />
			</Popover>
		</>
	);
}
