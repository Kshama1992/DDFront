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
import BrandInterface from 'dd-common-blocks/dist/interface/brand.interface';
import BrandService from '@service/brand.service';

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

function BrandChipsBlockInput({
	initialValues = [],
	onChange,
	brands,
	isReadOnly = false,
}: {
	initialValues?: BrandInterface[];
	onChange: (brands: BrandInterface[]) => void;
	brands: BrandInterface[];
	isReadOnly?: boolean | undefined;
}) {
	const classes = useStyles({});
	const { getInputProps, getTagProps, getListboxProps, getOptionProps, groupedOptions, value, focused, setAnchorEl } = useAutocomplete({
		multiple: true,
		options: brands,
		isOptionEqualToValue: (o, v) => Number(o.id) === Number(v.id),
		defaultValue: initialValues,
		getOptionLabel: (option) => (typeof option === 'string' ? option : option.name),
		onChange: (v, val) => onChange(val as BrandInterface[]),
	});

	return (
		<>
			<div className={classes.root}>
				<div ref={setAnchorEl} className={focused ? 'focused' : ''}>
					<TextField
						disabled={isReadOnly}
						className={classes.textField}
						variant="standard"
						placeholder="Start typing brand name"
						inputProps={{ ...getInputProps() }}
					/>
				</div>
				{!isReadOnly && groupedOptions.length > 0 ? (
					<ul className={classes.list} {...getListboxProps()}>
						{(groupedOptions as BrandInterface[]).map((option, index) => (
							<li key={index} {...getOptionProps({ option, index })}>
								<span>{option.name}</span>
								<CheckIcon fontSize="small" />
							</li>
						))}
					</ul>
				) : null}
			</div>

			<div className={classes.root}>
				{value.map((option: BrandInterface, index: number) => (
					<Tag isReadOnly={isReadOnly} label={option.name} {...getTagProps({ index })} key={index} />
				))}
			</div>
		</>
	);
}

export default function BrandChipsBlock({
	initialValues = [],
	onChange,
	isReadOnly = false,
}: {
	initialValues?: BrandInterface[];
	onChange: (brands: BrandInterface[]) => void;
	isReadOnly?: boolean | undefined;
}) {
	const classes = useStyles({});
	const brandService = new BrandService();
	const [brands, setBrands] = useState<BrandInterface[]>([]);
	const [loading, setLoading] = useState(true);
	const loadBrands = useCallback(async () => {
		setLoading(true);
		try {
			const [loadedBrands] = await brandService.list({ limit: 999 });
			setBrands(loadedBrands);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	}, [initialValues]);

	useEffect(() => {
		loadBrands().then();
	}, [initialValues]);

	if (loading && !brands.length) return <CircularProgress />;

	return (
		<Grid item xs={12}>
			<Typography variant="body1" className={classes.label}>
				Brand visibility
			</Typography>
			<Divider />
			<BrandChipsBlockInput isReadOnly={isReadOnly} brands={brands} initialValues={initialValues} onChange={onChange} />
		</Grid>
	);
}
