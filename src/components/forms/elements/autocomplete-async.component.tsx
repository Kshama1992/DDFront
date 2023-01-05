import React, { ForwardedRef, forwardRef, HTMLAttributes, SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import SpaceService from '@service/space.service';
import throttle from '@helpers/throttle.helper';
import Typography from '@mui/material/Typography';
import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import BaseListFilterInterface from 'dd-common-blocks/dist/interface/filter/base-list-filter.interface';
import BrandService from '@service/brand.service';
import UserService from '@service/user.service';
import VenueService from '@service/venue.service';
import AvatarComponent from '@shared-components/avatar.component';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import SpacePriceComponent from '@shared-components/space-price.component';
import VenueTypeService from '@service/venue-type.service';

const useStyles = makeStyles(() =>
	createStyles({
		avatar: {
			display: 'inline-block',
			marginRight: 10,
			marginBottom: -10,
			width: 25,
			height: 25,
			lineHeight: '25px',
			marginTop: -10,
			float: 'left',
		},
		spacePrice: {
			display: 'inline-block',
		},
	})
);

const allItems = { id: 0, name: 'All', domain: 'all', createdAt: new Date(), updatedAt: new Date() };

function getServiceByType(
	type: 'space' | 'venue' | 'user' | 'brand' | 'venueType'
): BrandService | UserService | VenueService | SpaceService | VenueTypeService {
	switch (type) {
		case 'brand':
			return new BrandService();
		case 'user':
			return new UserService();
		case 'venue':
			return new VenueService();
		case 'venueType':
			return new VenueTypeService();
		default:
			return new SpaceService();
	}
}
type AutocompleteParams<T extends BaseListFilterInterface> = {
	disabled?: boolean;
	disableClearable?: boolean;
	showLabel?: boolean;
	showPrice?: boolean;
	showAll?: boolean;
	showImage?: boolean;
	error?: any;
	filter?: T;
	onChange?: (userId: any) => any;
	label?: string;
	defaultValue?: number | undefined;
	shrink?: boolean;
	onlyIds?: number[];
	variant?: 'outlined' | 'filled' | 'standard';
	type?: 'space' | 'venue' | 'user' | 'brand' | 'venueType';
};

function AutocompleteAsync<T extends BaseListFilterInterface>(
	{
		showLabel = true,
		disabled = false,
		disableClearable = false,
		defaultValue,
		onChange,
		filter,
		label = 'Space',
		showAll = false,
		showPrice = false,
		showImage = false,
		onlyIds = [],
		error,
		variant = 'outlined',
		shrink = true,
		type = 'user',
		...rest
	}: AutocompleteParams<T>,
	ref: ForwardedRef<any>
) {
	const classes = useStyles();
	const service = getServiceByType(type);
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [initialLoading, setInitialLoading] = useState(true);
	const [loadingError, setLoadingError] = useState<string | undefined>();
	const [searchValue, setSearchValue] = useState<string>('');
	const [options, setOptions] = useState<any>([]);
	const [value, setValue] = useState<any | null>(null);
	const [apiParams, setApiParams] = useState<T>();

	// @ts-ignore
	const getOptions = (isInitial: boolean, searchString: string, inputFilter: T) => ({
		limit: 10,
		searchString,
		...inputFilter,
		includeIds: [],
	});

	const loadItems = useCallback((opts: T) => {
		service
			.list(opts)
			.then(([items]) => {
				if (onlyIds && onlyIds.length) {
					// @ts-ignore
					items = items.filter((d) => onlyIds.includes(d.id));
				}

				if (showAll) {
					// @ts-ignore
					items = [allItems, ...items];
				}
				setOptions(items);
				if (initialLoading && defaultValue) {
					// @ts-ignore
					setValue(items.find((b) => b.id === Number(defaultValue)));
				}
				return items;
			})
			.catch((e) => {
				const { message } = e as Error;
				console.error(e);
				setLoadingError(message);
				return [];
			})
			.finally(() => {
				setIsLoading(false);
				setInitialLoading(false);
			});
	}, []);

	const fetch = useMemo(
		() =>
			throttle((request: { input: string; inputInitialLoading: boolean }) => {
				if (request.inputInitialLoading && isNaN(parseInt(request.input))) return false;
				setIsLoading(true);
				loadItems(getOptions(request.inputInitialLoading, request.input, filter));
			}, 500),
		[]
	);

	useEffect(() => {
		if (JSON.stringify(filter) !== JSON.stringify(apiParams)) {
			setApiParams(filter);
			loadItems(getOptions(initialLoading, searchValue, filter));
		}
	}, [filter]);

	useEffect(() => {
		if (searchValue === value?.name) return;
		let active = true;
		// @ts-ignore
		fetch({ input: searchValue, inputInitialLoading: initialLoading }, (results: any) => {
			if (active) {
				let newOptions: any[] = [];
				if (value) {
					newOptions = [value];
				}
				if (results) {
					newOptions = results;
				}
				setOptions(newOptions);
			}
		});

		return () => {
			active = false;
		};
	}, [value, searchValue, fetch]);

	const handleChange = (e: any, newVal: any) => {
		setValue(newVal);
		if (onChange) {
			onChange(newVal ? newVal.id : null);
		}
	};

	const getOptionLabel = (option: any) => {
		if (typeof option === 'string') return option;
		if (typeof option === 'number') {
			if (type === 'user') {
				const item = options.find((o: any) => o.id === option);
				return item ? `${item.firstname} ${item.lastname}` : String(option);
			}
			const item = options.find((o: any) => o.id === option);
			return item ? `${item.name}` : String(option);
		}

		if (type === 'user') return `${option.firstname} ${option.lastname}`;
		return `${option.name}`;
	};

	const renderOption = (props: HTMLAttributes<HTMLLIElement>, option: any) => {
		const userInner = (
			<>
				<AvatarComponent
					className={classes.avatar}
					size="xs"
					altText={option.firstname}
					src={option.photo ? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${option.photo.url}` : undefined}
				/>
				{option.firstname} {option.lastname}
			</>
		);

		const commonInner = (
			<p style={{ width: '100%' }}>
				{showImage && (
					<AvatarComponent
						className={classes.avatar}
						size="xs"
						src={`${process.env.RAZZLE_RUNTIME_MEDIA_URL}${
							option.photos && option.photos.length ? option.photos[0].url : option.venue.photos![0].url
						}`}
					/>
				)}
				<span style={{ float: 'left' }}>
					{option.name}{' '}
					{type === 'space' && (
						<>
							<br />
							{option.venue.name}
						</>
					)}
				</span>
				{type === 'space' && showPrice && (
					<span style={{ float: 'right' }}>
						{' - '}
						<SpacePriceComponent space={option} className={classes.spacePrice} />
					</span>
				)}
			</p>
		);
		return (
			<li {...props} key={option.id}>
				{type === 'user' && userInner}
				{type !== 'user' && commonInner}
			</li>
		);
	};

	const isOptionEqualToValue = (option: any, newVal: any) => {
		if (!option || !newVal) return false;
		if (typeof newVal === 'string') return false;
		if (typeof newVal === 'number') return option.id === newVal;
		return option.id === newVal.id;
	};

	const renderInput = (params: AutocompleteRenderInputParams) => {
		return (
			<>
				<TextField
					{...params}
					{...rest}
					error={!!error}
					label={showLabel ? label : undefined}
					variant={variant}
					value={searchValue}
					disabled={disabled || isLoading}
					placeholder={`Please select ${type}`}
					InputLabelProps={{
						shrink: !!value || shrink,
					}}
					InputProps={{
						...params.InputProps,
						endAdornment: (
							<React.Fragment>
								{isLoading ? <CircularProgress color="inherit" size={20} /> : null}
								{params.InputProps.endAdornment}
							</React.Fragment>
						),
					}}
				/>
				{error && <FormHelperText error>{error.message}</FormHelperText>}
			</>
		);
	};

	const onInputChange = (event: SyntheticEvent, newInputValue: string) => setSearchValue(newInputValue);

	const onOpen = () => setOpen(true);

	const onClose = () => setOpen(false);

	if (loadingError) return <Typography>Error: {loadingError}</Typography>;

	return (
		<Autocomplete
			id={`select-${type}-async`}
			open={open}
			ref={ref}
			value={value}
			onOpen={onOpen}
			onClose={onClose}
			autoHighlight
			autoComplete
			disabled={disabled}
			disableClearable={disabled || disableClearable}
			isOptionEqualToValue={isOptionEqualToValue}
			getOptionLabel={getOptionLabel}
			options={options}
			loading={isLoading}
			renderOption={renderOption}
			onInputChange={onInputChange}
			onChange={handleChange}
			renderInput={renderInput}
			{...rest}
		/>
	);
}

export default forwardRef(AutocompleteAsync);
