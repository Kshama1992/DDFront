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
import VenueInterface from 'dd-common-blocks/dist/interface/venue.interface';
import VenueService from '@service/venue.service';
import VenueStatus from 'dd-common-blocks/dist/type/VenueStatus';

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

function VenueChipsBlockInput({
	initialValues = [],
	onChange,
	venues,
	isReadOnly = false,
	error = false,
}: {
	initialValues?: VenueInterface[];
	onChange: (venues: VenueInterface[]) => void;
	venues: VenueInterface[];
	isReadOnly?: boolean | undefined;
	error?: boolean | undefined;
}) {
	const classes = useStyles({});
	const { getInputProps, getTagProps, getListboxProps, getOptionProps, groupedOptions, value, focused, setAnchorEl } = useAutocomplete({
		multiple: true,
		options: venues,
		isOptionEqualToValue: (o, v) => Number(o.id) === Number(v.id),
		defaultValue: initialValues,
		getOptionLabel: (option) => (typeof option === 'string' ? option : option.name),
		onChange: (v, val) => onChange(val as VenueInterface[]),
	});

	return (
		<>
			<div className={classes.root}>
				<div ref={setAnchorEl} className={focused ? 'focused' : ''}>
					<TextField
						error={error}
						disabled={isReadOnly}
						variant="standard"
						className={classes.textField}
						placeholder="Start typing venue name"
						inputProps={{ ...getInputProps() }}
					/>
				</div>
				{!isReadOnly && groupedOptions.length > 0 ? (
					<ul className={classes.list} {...getListboxProps()}>
						{(groupedOptions as VenueInterface[]).map((option, index) => (
							<li key={index} {...getOptionProps({ option, index })}>
								<span>{option.name}</span>
								<CheckIcon fontSize="small" />
							</li>
						))}
					</ul>
				) : null}
			</div>

			<div className={classes.root}>
				{value.map((option: VenueInterface, index: number) => (
					<Tag isReadOnly={isReadOnly} label={option.name} {...getTagProps({ index })} key={index} />
				))}
			</div>
		</>
	);
}

function VenueChipsBlock({
	initialValues = [],
	onChange,
	isReadOnly = false,
	error = false,
	filter = { brandIds: [], venueTypeIds: [] },
	brandId,
}: {
	initialValues?: VenueInterface[];
	onChange: (venues: VenueInterface[]) => void;
	isReadOnly?: boolean | undefined;
	brandId?: number | undefined;
	filter?: { brandIds: number[]; venueTypeIds: number[] };
	error?: boolean | undefined;
}) {
	const classes = useStyles({});
	const venueService = new VenueService();
	const [venues, setVenues] = useState<VenueInterface[]>([]);
	const [loading, setLoading] = useState(true);

	const loadVenues = useCallback(async () => {
		setLoading(true);
		try {
			const [loadedVenues] = await venueService.list({ ...filter, brandId, status: VenueStatus.PUBLISH });
			setVenues(loadedVenues);
			setLoading(false);
		} catch (e) {
			console.error(e);
		}
	}, []);

	useEffect(() => {
		loadVenues().then();
	}, [brandId]);

	if (loading) return <CircularProgress />;

	return (
		<Grid item xs={12}>
			<Typography variant="body1" className={classes.label}>
				Venue visibility
			</Typography>
			<Divider />
			<VenueChipsBlockInput error={error} isReadOnly={isReadOnly} venues={venues} initialValues={initialValues} onChange={onChange} />
		</Grid>
	);
}

export default VenueChipsBlock;
