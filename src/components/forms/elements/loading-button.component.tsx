import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

interface LoadingButtonInterface {
	text: string;
	isLoading?: boolean;
	type?: 'submit' | 'reset' | 'button' | undefined;
	onClick?: () => any;
	variant?: 'text' | 'outlined' | 'contained';
	color?: 'inherit' | 'primary' | 'secondary' | undefined;
	size?: 'small' | 'medium' | 'large';
	disabled?: boolean;
	autoFocus?: boolean;
	fullWidth?: boolean;
	style?: any;
	className?: any;
	endIcon?: React.ReactNode;
	startIcon?: React.ReactNode;
}

export default function LoadingButton({
	size = 'medium',
	text,
	isLoading = false,
	type = 'submit',
	onClick,
	variant = 'contained',
	color = 'primary',
	disabled = false,
	autoFocus = true,
	fullWidth = false,
	className,
	...rest
}: LoadingButtonInterface) {
	return (
		<Button
			variant={variant}
			autoFocus={autoFocus}
			fullWidth={fullWidth}
			type={type}
			onClick={onClick}
			disabled={isLoading || disabled}
			color={color}
			size={size}
			className={className}
			{...rest}
		>
			{isLoading && (
				<>
					<CircularProgress size={14} style={{ marginRight: 5 }} />
					<Typography
						style={{ fontSize: 14 }}
						dangerouslySetInnerHTML={{
							__html: text,
						}}
					/>
				</>
			)}
			{!isLoading && text}
		</Button>
	);
}
