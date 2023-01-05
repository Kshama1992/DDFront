// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import useAutocomplete from '@mui/material/useAutocomplete';
import CheckIcon from '@mui/icons-material/Check';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import VenueTypeInterface from 'dd-common-blocks/dist/interface/venue-type.interface';
import VenueTypeService from '@service/venue-type.service';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
			justifyContent: 'center',
			flexWrap: 'wrap',
			position: 'relative',
			'& > *': {
				margin: theme.spacing(0.5),
			},
		},
		label: {
			fontWeight: 500,
			marginLeft: 0,
			fontSize: 12,
			textTransform: 'none',
		},
		textField: {
			minWidth: 450,
			[theme.breakpoints.down('md')]: {
				width: '100%',
				minWidth: '100%',
			},
		},

		list: {
			width: '300px',
			margin: '55px 0 0',
			padding: 0,
			position: 'absolute',
			listStyle: 'none',
			backgroundColor: '#fff',
			overflow: 'auto',
			maxHeight: 250,
			borderRadius: 4,
			boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
			zIndex: 100,
			'& li': {
				padding: '5px 12px',
				display: 'flex',
				'& span': {
					flexGrow: 1,
				},
				'& svg': {
					color: 'transparent',
				},
			},
			"& li[aria-selected='true']": {
				backgroundColor: '#fafafa',
				fontWeight: 600,
				'& svg': {
					color: '#1890ff',
				},
			},
			"& li[data-focus='true']": {
				backgroundColor: '#e6f7ff',
				cursor: 'pointer',
				'& svg': {
					color: '#000',
				},
			},
		},
	})
);

function Tag({ label, onDelete, isReadOnly = false, ...props }: { label: any; onDelete?: any; isReadOnly?: boolean | undefined }) {
	return <Chip {...props} disabled={isReadOnly} color="primary" avatar={<Avatar>M</Avatar>} label={label} onDelete={onDelete} />;
}

function VenueTypeChipsInput({
	initialValues = [],
	onChange,
	types,
	isReadOnly = false,
}: {
	initialValues?: VenueTypeInterface[];
	onChange: (types: VenueTypeInterface[]) => void;
	types: VenueTypeInterface[];
	isReadOnly?: boolean | undefined;
}) {
	const classes = useStyles({});

	const { getInputProps, getTagProps, getListboxProps, getOptionProps, groupedOptions, value, focused, setAnchorEl } = useAutocomplete({
		multiple: true,
		options: types,
		isOptionEqualToValue: (o, v) => Number(o.id) === Number(v.id),
		defaultValue: initialValues,
		getOptionLabel: (option) => (typeof option === 'string' ? option : option.name),
		onChange: (v, val) => onChange(val as VenueTypeInterface[]),
	});

	return (
		<>
			<div className={classes.root}>
				<div ref={setAnchorEl} className={focused ? 'focused' : ''}>
					<TextField
						inputProps={{ ...getInputProps() }}
						disabled={isReadOnly}
						className={classes.textField}
						placeholder="Start typing venue type name"
						variant="standard"
					/>
				</div>
				{!isReadOnly && groupedOptions.length > 0 ? (
					<ul className={classes.list} {...getListboxProps()}>
						{(groupedOptions as VenueTypeInterface[]).map((option, index) => (
							<li {...getOptionProps({ option, index })} key={index}>
								<span>{option.name}</span>
								<CheckIcon fontSize="small" />
							</li>
						))}
					</ul>
				) : null}
			</div>

			<div className={classes.root}>
				{(value as VenueTypeInterface[]).map((option: VenueTypeInterface, index: number) => (
					<Tag isReadOnly={isReadOnly} label={option.name} {...getTagProps({ index })} key={index} />
				))}
			</div>
		</>
	);
}

export default function VenueTypeChipsBlock({
	initialValues = [],
	onChange,
	isReadOnly = false,
}: {
	initialValues?: VenueTypeInterface[];
	onChange: (types: VenueTypeInterface[]) => void;
	isReadOnly?: boolean | undefined;
}) {
	const classes = useStyles({});
	const typesService = new VenueTypeService();
	const [loading, setLoading] = useState(true);
	const [types, setTypes] = useState<VenueTypeInterface[]>([]);

	const loadTypes = useCallback(async () => {
		setLoading(true);
		try {
			const [loadedTypes] = await typesService.list({ limit: 130 });
			setTypes(loadedTypes);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadTypes().then();
	}, []);

	if (loading && !types.length) return <CircularProgress />;

	return (
		<Grid item xs={12}>
			<Typography variant="body1" className={classes.label}>
				Venue Types visibility
			</Typography>
			<Divider />
			<VenueTypeChipsInput isReadOnly={isReadOnly} types={types} initialValues={initialValues} onChange={onChange} />
		</Grid>
	);
}
