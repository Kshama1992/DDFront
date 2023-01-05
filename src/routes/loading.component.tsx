import React, { forwardRef } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingComponent = forwardRef((props, ref) => (
	<div
		style={{
			zIndex: 9999,
			color: '#fff',
			backgroundColor: 'rgba(0,0,0,0.2)',
			width: '100%',
			height: '100%',
			position: 'fixed',
			top: 0,
			left: 0,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		}}
		{...props}
	>
		<CircularProgress color="primary" />
	</div>
));

export default LoadingComponent;

// export default function LoadingComponent() {
// 	return forwardRef((props, ref) => (
// 		<Backdrop
// 			style={{
// 				zIndex: 9999,
// 				color: '#fff',
// 				backgroundColor: 'rgba(0,0,0,0.2)',
// 				width: '100%',
// 				height: '100%',
// 				position: 'fixed',
// 				top: 0,
// 				left: 0,
// 			}}
// 			open
// 			{...props}
// 			ref={ref}
// 		>
// 			<CircularProgress color="primary" />
// 		</Backdrop>
// 	));
// }
