import React, { memo } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Controller } from 'react-hook-form';
import Select from '@mui/material/Select';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { SpaceStatus } from 'dd-common-blocks/dist/interface/space.interface';

const useStyles = makeStyles(() =>
	createStyles({
		formControl: {
			width: '100%',
		},
		selectEmpty: {},
	})
);

function SelectPackageStatusComponent({
	showLabel = true,
	disabled = false,
	control,
	required = false,
	hideDeleted = false,
	error,
}: {
	disabled?: boolean;
	showLabel?: boolean;
	control: any;
	required?: boolean;
	error?: any;
	hideDeleted?: boolean;
}) {
	const classes = useStyles();

	return (
		<FormControl className={classes.formControl} disabled={disabled}>
			{showLabel && (
				<InputLabel id="select-package-status-label" shrink>
					Package status
				</InputLabel>
			)}
			<Controller
				render={({ field }) => (
					<Select {...field} labelId="select-package-status-label" variant="outlined" error={!!error}>
						<MenuItem value={SpaceStatus.PUBLISH}>Published</MenuItem>
						<MenuItem value={SpaceStatus.UNPUBLISED}>Unpublished</MenuItem>
						{!hideDeleted && <MenuItem value={SpaceStatus.DELETED}>Deleted</MenuItem>}
					</Select>
				)}
				name="status"
				control={control}
				rules={{ required }}
			/>
		</FormControl>
	);
}

export default memo(SelectPackageStatusComponent);
