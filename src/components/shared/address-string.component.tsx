import React from 'react';
import Typography from '@mui/material/Typography';

type Variant =
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'h5'
	| 'h6'
	| 'subtitle1'
	| 'subtitle2'
	| 'body1'
	| 'body2'
	| 'caption'
	| 'button'
	| 'overline';

interface AddressStringProps {
	className?: string;
	style?: React.CSSProperties;
	component?: any;
	addressString: string;
	align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
	/**
	 * The content of the component.
	 */
	children?: React.ReactNode;
	color?: 'initial' | 'inherit' | 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'error';
	display?: 'initial' | 'block' | 'inline';
	gutterBottom?: boolean;
	noWrap?: boolean;
	paragraph?: boolean;
	variant?: Variant | 'inherit';
}

export default function AddressString(props: AddressStringProps) {
	const { addressString: string, component, ...filteredProps } = props;
	return (
		<Typography
			dangerouslySetInnerHTML={{
				__html: string,
			}}
			component={component || 'p'}
			{...filteredProps}
		/>
	);
}
