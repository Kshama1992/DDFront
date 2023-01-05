import React, { useEffect, useState, memo, useCallback } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Controller } from 'react-hook-form';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import SpaceTypeService from '@service/space-type.service';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles(() =>
	createStyles({
		formControl: {
			width: '100%',
		},
		selectEmpty: {},
	})
);

function SelectSpaceTypeComponent({
	showLabel = true,
	showAll = false,
	disabled = false,
	control,
	required = false,
	name = 'spaceTypeId',
	...rest
}: {
	disabled?: boolean;
	showAll?: boolean;
	showLabel?: boolean;
	control: any;
	required?: boolean;
	name?: string;
}) {
	const classes = useStyles();
	const error = control.formStateRef?.current.errors[name];
	const [types, setTypes] = useState<SpaceTypeInterface[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadingError, setLoadingError] = useState<string>();
	const spaceTypeService = new SpaceTypeService();

	const loadSpaces = useCallback(async () => {
		try {
			const [typesResp] = await spaceTypeService.list({ onlyChildren: true, withCache: true });
			setTypes(typesResp);
			setIsLoading(false);
		} catch (e) {
			setLoadingError((e as Error).message);
		}
	}, []);

	useEffect(() => {
		loadSpaces().then();
	}, []);

	if (isLoading) return <CircularProgress />;
	if (loadingError) return <Typography>Error: {loadingError}</Typography>;

	return (
		<FormControl className={classes.formControl} disabled={disabled || isLoading} error={!!error}>
			{showLabel && (
				<InputLabel shrink id="select-space-type-label">
					Space Type
				</InputLabel>
			)}
			<Controller
				render={({ field }) => (
					<Select
						{...field}
						labelId="select-space-type-label"
						displayEmpty
						variant="outlined"
						name={name}
						placeholder="Space type"
						{...rest}
					>
						{isLoading && (
							<MenuItem value="" selected>
								Loading...
							</MenuItem>
						)}
						{!isLoading && showAll && (
							<MenuItem value="" selected>
								All
							</MenuItem>
						)}
						{types.map((i: SpaceTypeInterface) => (
							<MenuItem value={i.id} key={i.id}>
								{i.name}
							</MenuItem>
						))}
					</Select>
				)}
				name={name}
				control={control}
				rules={{ required: required ? 'This field is Required' : false }}
				defaultValue=""
			/>
			{error && <FormHelperText error>{error.message}</FormHelperText>}
		</FormControl>
	);
}

export default memo(SelectSpaceTypeComponent);
