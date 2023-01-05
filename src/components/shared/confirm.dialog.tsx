import React, { memo } from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import LoadingButton from '@forms/elements/loading-button.component';

const ConfirmDialog = memo(
	({
		text,
		actionText = 'Delete',
		cancelText = 'Cancel',
		isLoading = false,
		open,
		onClose,
		action,
	}: {
		text: string | undefined;
		actionText?: string | undefined;
		cancelText?: string | undefined;
		open: boolean;
		isLoading?: boolean;
		onClose: () => void;
		action: () => any;
	}) => (
		<Dialog open={open} onClose={() => onClose()}>
			<DialogContent>
				<DialogContentText>{text}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => onClose()} color="primary" autoFocus>
					{cancelText}
				</Button>
				<LoadingButton text={actionText} isLoading={isLoading} onClick={action} color="primary" variant="text" />
			</DialogActions>
		</Dialog>
	)
);

export default ConfirmDialog;
