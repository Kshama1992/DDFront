import React, { Suspense } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { SnackBarProvider } from '@context/snack-bar.context';
import Router from '../routes/router';
import LoadingComponent from '../routes/loading.component';

function App() {
	return (
		<SnackBarProvider>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<Suspense fallback={<LoadingComponent />}>
					<Router />
				</Suspense>
			</LocalizationProvider>
		</SnackBarProvider>
	);
}

export default App;
