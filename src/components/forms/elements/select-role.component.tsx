import React, { useEffect, useState, memo, useCallback } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Controller } from 'react-hook-form';

import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import BrandRoleInterface from 'dd-common-blocks/dist/interface/brand-role.interface';
import RoleService from '@service/role.service';

const useStyles = makeStyles(() =>
	createStyles({
		formControl: {
			width: '100%',
		},
		selectEmpty: {},
		avatar: {
			display: 'inline-block',
			marginRight: 10,
			marginBottom: -10,
		},
		spacePrice: {
			display: 'inline-block',
		},
		spaceItem: {
			marginBottom: 10,
			paddingBottom: 10,
		},
	})
);

function SelectRoleComponent({
	showLabel = true,
	showAll = false,
	disabled = false,
	required = false,
	control,
	name = 'roleId',
	filter,
}: {
	disabled?: boolean;
	required?: boolean;
	showAll?: boolean;
	showLabel?: boolean;
	control: any;
	name?: string;
	filter?: any;
}) {
	const classes = useStyles();
	const roleService = new RoleService();

	const [options, setOptions] = useState<BrandRoleInterface[]>([]);
	const [oldFilters, setOldFilters] = useState<any>({});
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isInited, setIsInited] = useState<boolean>(false);

	const error = control.formStateRef?.current.errors[name];

	const loadRoles = useCallback(async () => {
		if (isInited && JSON.stringify(filter) === JSON.stringify(oldFilters)) return;

		setIsLoading(true);
		try {
			const [data] = await roleService.list({ limit: 130, ...filter });
			setOptions(data);
			setOldFilters(filter);
			setIsInited(true);
		} catch (e) {
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	}, [filter]);

	useEffect(() => {
		loadRoles().then();
	}, [filter]);

	return (
		<FormControl className={classes.formControl} disabled={disabled || isLoading} error={!!error}>
			{showLabel && (
				<InputLabel shrink id="select-role-label">
					Role
				</InputLabel>
			)}

			{!isLoading && (
				<Controller
					render={({ field }) => (
						<Select {...field} labelId="select-role-label" displayEmpty variant="outlined" name={name} placeholder="Role">
							{showAll && (
								<MenuItem value="" selected>
									All
								</MenuItem>
							)}
							{options.map((i: BrandRoleInterface) => (
								<MenuItem value={i.id} key={i.id} className={classes.spaceItem}>
									{i.name} {i.brand && `(${i.brand.name})`}
								</MenuItem>
							))}
							{options.length === 0 && (
								<MenuItem value="" className={classes.spaceItem} selected>
									No roles in brand
								</MenuItem>
							)}
							{isLoading && (
								<MenuItem value="" className={classes.spaceItem} selected>
									Loading...
								</MenuItem>
							)}
						</Select>
					)}
					name={name}
					control={control}
					rules={{ required: required ? 'This field is Required' : false }}
				/>
			)}

			{error && <FormHelperText error>{error.message}</FormHelperText>}
			{isLoading && <FormHelperText>Loading...</FormHelperText>}
		</FormControl>
	);
}

export default memo(SelectRoleComponent);
