import React, { memo } from 'react';
import classnames from 'classnames';
import { Theme, useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Avatar from '@mui/material/Avatar';
import { useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		md: {
			width: theme.spacing(10),
			height: theme.spacing(10),
		},
		sm: {
			width: theme.spacing(8),
			height: theme.spacing(8),
		},
		xs: {
			width: theme.spacing(5),
			height: theme.spacing(5),
			fontSize: 14,
			textAlign: 'center',
		},
		lg: {
			width: theme.spacing(13),
			height: theme.spacing(13),
		},
	})
);

function AvatarComponent({
	size = 'md',
	variant = 'circular',
	src,
	className,
	altText = '',
	url,
}: {
	className?: string;
	size?: 'xs' | 'sm' | 'md' | 'lg';
	variant?: 'circular' | 'rounded' | 'square';
	src: string | undefined;
	altText?: string;
	url?: string;
}) {
	const theme = useTheme();
	const classes = useStyles();

	let sizeClass = classes[size];

	const isMobile = useMediaQuery(theme.breakpoints.only('xs'));
	const isTablet = useMediaQuery(theme.breakpoints.only('md'));
	const isLaptop = useMediaQuery(theme.breakpoints.only('lg'));

	if (size === 'lg' && isLaptop) {
		sizeClass = classes.md;
	}

	if (size === 'lg' && (isMobile || isTablet)) {
		sizeClass = classes.sm;
	}

	if (size === 'md' && isLaptop) {
		sizeClass = classes.sm;
	}

	if (size === 'md' && (isMobile || isTablet)) {
		sizeClass = classes.xs;
	}

	if (url) {
		return (
			<Avatar component={Link} to={url} className={classnames(sizeClass, className)} variant={variant} src={src} alt={altText}>
				{altText.substring(0, 2)}
			</Avatar>
		);
	}
	return (
		<Avatar className={classnames(sizeClass, className)} variant={variant} src={src} alt={altText}>
			{altText.substring(0, 2)}
		</Avatar>
	);
}

export default memo(AvatarComponent);
