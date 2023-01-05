import React, { useRef } from 'react';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';

import { Scrollbars } from 'react-custom-scrollbars';

const styles = createStyles({});

interface Props {
	children: any;
	style?: any;
	autoHide?: boolean;
	className?: any;
	classes?: { [className in keyof typeof styles]: string };
	onScroll?: any;
}

const CustomScrollbar = ({ children, onScroll, ...props }: Props) => {
	const ScrollbarsRef = useRef<any>(null);

	const handleScroll = (e: any) => {
		if (onScroll) onScroll(e, ScrollbarsRef);
	};

	return (
		<Scrollbars universal onScroll={handleScroll} ref={ScrollbarsRef} {...props}>
			{children}
		</Scrollbars>
	);
};

export default withStyles(styles)(CustomScrollbar);
