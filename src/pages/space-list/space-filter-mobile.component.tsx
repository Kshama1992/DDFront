import React, { memo, useCallback, useEffect, useState } from 'react';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Collapse from '@mui/material/Collapse';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import SpaceFilterInterface from 'dd-common-blocks/dist/interface/filter/space-filter.interface';
import SpaceTypeService from '@service/space-type.service';
import { GeolocationData } from '@helpers/geolocate.helper';
import { debounce } from '@helpers/debounce.helper';
import SpaceLocationSelectComponent from './space-location-select.component';

const useStyles = makeStyles((theme) =>
	createStyles({
		root: {
			backgroundColor: theme.palette.primary.main,
		},
		spaceFiltersTitle: {
			fontWeight: 500,
			textTransform: 'uppercase',
			marginBottom: 0,
			fontSize: 11,
		},
		checkboxFilter: {
			color: theme.palette.primary.main,
			'& + p': {
				margin: '2px 15px 0px -8px',
				fontSize: 14,
			},
		},
		filterCheckboxText: {
			fontSize: 14,
			display: 'inline',
		},
		container: {
			flexGrow: 1,
			position: 'relative',
		},

		rowReverse: {
			flexDirection: 'row-reverse',
		},
		btnsHolder: {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'left',
			paddingTop: 7,
			minWidth: 100,
			'& p ': {
				marginBottom: 0,
				fontSize: 14,
				margin: '0 10px',
			},
			'& svg': {
				fontSize: 24,
				color: theme.palette.primary.main,
			},
		},
		checkboxFilterIcon: {
			color: theme.palette.primary.main,
			fontSize: 22,
		},
		divider: {
			width: '100%',
			marginBottom: 15,
			marginTop: 10,
		},
		panelSummaryClosed: {
			backgroundColor: '#fff',
			height: 40,
			transition: 'all .2s ease',
			display: 'flex',
			alignItems: 'center',
			paddingLeft: '15px',
			minHeight: 'auto',
			'& p ': {
				marginBottom: 0,
				fontSize: 14,
				margin: '0 10px',
				color: theme.palette.primary.main,
				fontWeight: 600,
			},
			'& svg ': {
				marginBottom: 0,
				fontSize: 20,
				margin: '0 10px',
				color: theme.palette.primary.main,
			},
		},
		panelSummaryOpen: {
			backgroundColor: '#fff',
			height: 40,
			transition: 'all .2s ease',
			display: 'flex',
			alignItems: 'center',
			paddingLeft: '15px',
			minHeight: 'auto !important',
			'& p ': {
				marginBottom: 0,
				fontSize: 14,
				margin: '0 10px',
				color: theme.palette.primary.main,
				fontWeight: 600,
			},
			'& svg ': {
				marginBottom: 0,
				fontSize: 20,
				margin: '0 10px',
				color: theme.palette.primary.main,
			},
		},
		topFiltersIconWrap: {
			padding: '15px 15px 0 15px',
			'& .MuiSvgIcon-root': {
				color: '#fff',
				display: 'none',
			},
		},
		topCell: {
			border: 0,
			padding: '15px 15px 0 15px',
			'& .MuiSvgIcon-root': {
				color: '#333',
				padding: '0 10px',
			},

			'& .MuiFormControl-root, & .MuiInput-root': {
				margin: 0,
				padding: 0,
			},
			'& .MuiInput-input': {
				padding: '10px 0 !important',
			},
			'& .MuiAutocomplete-root': {
				padding: 0,
				margin: 0,
				backgroundColor: 'white',
				borderRadius: '5px !important',
			},
			'& .MuiFormLabel-root': {
				display: 'none',
			},
		},
		expansionPanel: {
			margin: '0 !important',
			borderBottom: '1px solid #dfdfdf',
			display: 'none',
		},
		input: {
			paddingLeft: 0,
			'& .MuiInput-underline:before': {
				display: 'none !important',
			},
			'& .MuiInput-underline:after': {
				display: 'none !important',
			},
		},
		bottomBtnActive: {
			textTransform: 'none',
			color: '#fff',
			marginBottom: 10,
			marginTop: 5,
			'&:hover': {
				color: '#fff',
			},
		},
		bottomBtn: {
			textTransform: 'none',
			color: '#fff',
			marginBottom: 10,
			marginTop: 5,
		},
		openIcon: {
			position: 'absolute',
			top: 10,
			color: theme.palette.primary.main,
			right: 10,
			zIndex: 999,
		},
		btn: {},
		btnActive: {
			color: '#fff',
			backgroundColor: theme.palette.primary.main,
			borderRadius: 0,
		},
		stwrap: {
			backgroundColor: '#fff',
			'& button': {
				width: '100%',
				textTransform: 'none',
				textAlign: 'left',
				justifyContent: 'flex-start',
				paddingLeft: 35,
				fontSize: 21,
				fontWeight: 300,
				paddingTop: 10,
				paddingBottom: 10,
				'& .MuiSvgIcon-root': {
					fontSize: 24,
					marginRight: 20,
				},
			},
		},
	})
);

const SpaceFilterMobileComponent = ({
	onChange,
	defaultValues,
	onFilterInitiated,
	venueName,
}: {
	venueName?: string;
	defaultValues: SpaceFilterInterface | undefined;
	onFilterInitiated: () => void;
	onChange: (params: { location: GeolocationData; spaceType: SpaceTypeInterface }) => void;
}) => {
	const all: SpaceTypeInterface = {
		name: 'All',
		alias: 'all',
		id: undefined,
		order: 1,
		color: '',
		brandId: 0,
		parentId: null,
		icon: null,
		logicType: SpaceTypeLogicType.MONTHLY,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
	const classes = useStyles();
	const spaceTypeService = new SpaceTypeService();
	const navigate = useNavigate();
	const [initiated, setInitiated] = useState<boolean>(false);
	const [parent, setParent] = useState<SpaceTypeInterface>(all);
	const [subTypes, setSubTypes] = useState<SpaceTypeInterface[]>([]);
	const [filtersVisible, setFiltersVisible] = useState<boolean>(false);
	const [expanded, setExpanded] = useState<boolean>(false);
	const [spaceTypes, setSpaceTypes] = useState<SpaceTypeInterface[]>([]);
	const [spaceTypesVisible, setSpaceTypesVisible] = useState<boolean>(false);
	const [spaceSubTypesVisible, setSpaceSubTypesVisible] = useState<boolean>(false);

	const [location, setLocation] = useState<GeolocationData | undefined>({
		country: defaultValues?.country || '',
		state: defaultValues?.state,
		longitude: Number(defaultValues?.longitude || 0),
		latitude: Number(defaultValues?.latitude || 0),
		city: defaultValues?.city,
	});
	const [spaceType, setSpaceType] = useState<SpaceTypeInterface>(all);

	const handleChanged = useCallback(
		debounce((filters) => {
			onChange(filters);
		}, 300),
		[location, spaceType]
	);

	useEffect(() => {
		if (location && spaceType) {
			if (!initiated) {
				setInitiated(true);
				onFilterInitiated();
			}
			handleChanged({ spaceType, location });
		}
	}, [location, spaceType]);

	const isSpaceSelected = (inputSpaceType: SpaceTypeInterface) => {
		const isChild = !inputSpaceType.children;

		if (isChild) {
			return (
				defaultValues &&
				defaultValues.spaceTypeIds &&
				defaultValues.spaceTypeIds.length === 1 &&
				Number(defaultValues.spaceTypeIds[0]) === inputSpaceType.id
			);
		}

		const spaceTypeIds = defaultValues && defaultValues.spaceTypeIds ? defaultValues.spaceTypeIds.map((st: number) => Number(st)) : [];
		let idsArr: number[] = [Number(inputSpaceType.id)];
		if (inputSpaceType.children) idsArr = [...idsArr, ...inputSpaceType.children?.map((ch) => Number(ch.id))];
		return idsArr.some((st: number) => spaceTypeIds.includes(st));
	};

	const loadSpaceTypes = useCallback(async () => {
		try {
			const [spaceTypesResp] = await spaceTypeService.list({ withChildren: true, withCache: true });
			setSpaceTypes(spaceTypesResp);
			const spaceSelected = spaceTypesResp.find((s) => isSpaceSelected(s));
			if (spaceSelected && spaceSelected.children) setSubTypes(spaceSelected.children);
		} catch (e) {
			console.error(e);
		}
	}, [spaceTypes]);

	useEffect(() => {
		loadSpaceTypes().then();
	}, []);

	const isSubAllSelected = () => {
		const spaceTypeIds = defaultValues && defaultValues.spaceTypeIds ? defaultValues.spaceTypeIds.map((st: number) => Number(st)) : [];
		const subParent = spaceTypes.find((st) => {
			const ch = st.children ? st.children.map((c) => Number(c.id)) : [];
			return ch.every((s) => spaceTypeIds.includes(s));
		});
		return !!subParent;
	};

	const selectSpaceType = (inputSpaceType: SpaceTypeInterface) => {
		setParent(inputSpaceType);
		setSpaceType(inputSpaceType);
		if (inputSpaceType.children) {
			setSubTypes(inputSpaceType.children);
		} else {
			setSubTypes([]);
		}
		setSpaceTypesVisible(false);
	};

	const setSubSpaceType = (inputSpaceType: SpaceTypeInterface) => {
		setSpaceType(!inputSpaceType.id ? parent : inputSpaceType);
		setSpaceSubTypesVisible(false);
	};

	const togglePanel = () => () => {
		setExpanded(!expanded);
	};

	const expandParent = () => {
		setSpaceTypesVisible(!spaceTypesVisible);
		setSpaceSubTypesVisible(false);
	};

	const expandChild = () => {
		setSpaceSubTypesVisible(!spaceSubTypesVisible);
		setSpaceTypesVisible(false);
	};

	const hideFilters = () => setFiltersVisible(false);
	const toggleFilters = () => setFiltersVisible(!filtersVisible);

	const deleteVenue = () => {
		navigate('/locations');
	};

	return (
		<>
			<IconButton className={classes.openIcon} onClick={toggleFilters} size="large">
				<SearchIcon />
			</IconButton>
			<Collapse in={filtersVisible}>
				<Grid container spacing={0} style={{ paddingTop: 10 }} className={classes.root}>
					<Grid item xs={10} className={classes.topCell}>
						<SpaceLocationSelectComponent
							showSearchIcon
							disableClearable={false}
							onSelect={hideFilters}
							onChange={setLocation}
							defaultValue={location}
						/>
					</Grid>
					<Grid item xs={2} className={classes.topFiltersIconWrap}>
						<TuneIcon onClick={togglePanel} />
					</Grid>
					<Grid item xs={4} />
					{subTypes.length === 0 && <Grid item xs={4} />}

					<Grid item xs={4}>
						<Button onClick={expandParent} className={classes.bottomBtnActive}>
							I’m Looking for
						</Button>
					</Grid>

					{subTypes.length > 0 && (
						<Grid item xs={4}>
							<Button onClick={expandChild} className={classes.bottomBtnActive}>
								Space Type
							</Button>
						</Grid>
					)}

					{spaceSubTypesVisible && spaceTypes && (
						<Grid item xs={12} className={classes.stwrap}>
							<Button
								onClick={() => selectSpaceType(all)}
								className={isSubAllSelected() ? classes.btnActive : classes.btn}
								startIcon={<LocationOnIcon style={{ color: '#2196f3' }} />}
							>
								All
							</Button>
							{subTypes.map((t) => (
								<Button
									onClick={() => setSubSpaceType(t)}
									key={t.id}
									className={isSpaceSelected(t) ? classes.btnActive : classes.btn}
									startIcon={<LocationOnIcon style={{ color: t.color || '#2196f3' }} />}
								>
									{t.name}
								</Button>
							))}
						</Grid>
					)}

					{spaceTypesVisible && spaceTypes && (
						<Grid item xs={12} className={classes.stwrap}>
							<Button
								onClick={() => selectSpaceType(all)}
								className={
									!defaultValues || !defaultValues.spaceTypeIds || !defaultValues.spaceTypeIds.length
										? classes.btnActive
										: classes.btn
								}
								startIcon={<LocationOnIcon style={{ color: '#2196f3' }} />}
							>
								All
							</Button>
							{spaceTypes.map((t) => (
								<Button
									onClick={() => selectSpaceType(t)}
									key={t.id}
									className={isSpaceSelected(t) ? classes.btnActive : classes.btn}
									startIcon={<LocationOnIcon style={{ color: t.color || '#2196f3' }} />}
								>
									{t.name}
								</Button>
							))}
						</Grid>
					)}

					<Grid item xs={12} style={{ paddingBottom: 15 }}>
						{venueName && <Chip size="small" color="primary" label={venueName} onDelete={deleteVenue} />}
					</Grid>
				</Grid>
			</Collapse>
		</>
	);
};

export default memo(SpaceFilterMobileComponent);
