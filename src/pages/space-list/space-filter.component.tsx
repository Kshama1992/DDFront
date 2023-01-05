import React, { memo, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import SpaceFilterInterface from 'dd-common-blocks/dist/interface/filter/space-filter.interface';
import { debounce } from '@helpers/debounce.helper';
import { GeolocationData } from '@helpers/geolocate.helper';
import SpaceTypeDropDownComponent from './space-type-dropdown.component';
import SpaceLocationSelectComponent from './space-location-select.component';

const useStyles = makeStyles((theme) =>
	createStyles({
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
		topCell: {
			// borderRight: '1px solid #dfdfdf',
		},
		expansionPanel: {
			margin: '0 !important',
			borderBottom: '1px solid #dfdfdf',
			display: 'none',
		},
		input: {
			paddingLeft: 15,
			'& .MuiInput-underline:before': {
				display: 'none !important',
			},
			'& .MuiInput-underline:after': {
				display: 'none !important',
			},

			'& label': {
				color: '#333',
				fontWeight: 500,
				fontSize: 14,
				paddingLeft: 15,
			},
			'& label + div': {
				background: 'none',
				margin: '15px 0 0 0',
			},
			'& input': {
				border: 'none',
				fontSize: 16,
				padding: 12,
				paddingLeft: 0,
			},
		},
	})
);

const SpaceFilterComponent = ({
	onChange,
	venueName,
	defaultValues,
	onFilterInitiated,
}: {
	venueName?: string;
	defaultValues: SpaceFilterInterface | undefined;
	onFilterInitiated: () => void;
	onChange: (params: { location: GeolocationData; spaceType: SpaceTypeInterface }) => void;
}) => {
	const classes = useStyles();
	const navigate = useNavigate();

	const [initiated, setInitiated] = useState<boolean>(false);
	const [subTypes, setSubTypes] = useState<SpaceTypeInterface[]>([]);

	const [location, setLocation] = useState<GeolocationData | undefined>({
		country: defaultValues?.country || '',
		state: defaultValues?.state,
		longitude: Number(defaultValues?.longitude || 0),
		latitude: Number(defaultValues?.latitude || 0),
		city: defaultValues?.city,
		radius: defaultValues?.radius,
	});
	const [parent, setParent] = useState<SpaceTypeInterface | undefined>();
	const [spaceType, setSpaceType] = useState<SpaceTypeInterface | undefined>();
	const [spaceSubTypeSelected, setSubTypeSelected] = useState<SpaceTypeInterface | undefined>();

	const handleChanged = useCallback(
		debounce((filters) => {
			// turn off change on default values
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

	useEffect(() => {
		if (defaultValues?.country)
			setLocation({
				country: defaultValues?.country || '',
				state: defaultValues?.state,
				longitude: Number(defaultValues?.longitude || 0),
				latitude: Number(defaultValues?.latitude || 0),
				city: defaultValues?.city,
				radius: defaultValues?.radius,
			});
	}, [defaultValues]);

	const selectSpaceType = (inputSpaceType: SpaceTypeInterface) => {
		setParent(inputSpaceType);
		setSpaceType(inputSpaceType);
		setSubTypeSelected({
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
		});
		if (inputSpaceType && inputSpaceType.children) {
			setSubTypes(inputSpaceType.children);
		} else {
			setSubTypes([]);
		}
	};

	const setSubSpaceType = (inputSpaceType: SpaceTypeInterface) => {
		if (inputSpaceType) {
			if (inputSpaceType.id) {
				setSpaceType(inputSpaceType);
			} else if (parent) {
				setSpaceType(parent);
			}
			setSubTypeSelected(inputSpaceType);
		}
	};

	const deleteVenue = () => {
		navigate('/locations');
	};
	return (
		<>
			<Grid container spacing={0} style={{ paddingTop: 10 }}>
				<Grid item xs={12} sm={4} className={classes.topCell}>
					<SpaceTypeDropDownComponent
						onChange={selectSpaceType}
						defaultValue={defaultValues && defaultValues.spaceTypeIds ? defaultValues.spaceTypeIds : undefined}
					/>
				</Grid>

				{subTypes.length > 0 && (
					<Grid item sm={4} xs={12} className={classes.topCell}>
						<SpaceTypeDropDownComponent
							onChange={setSubSpaceType}
							valuesArray={subTypes}
							defaultValue={spaceSubTypeSelected && spaceSubTypeSelected.id ? [spaceSubTypeSelected.id] : undefined}
							text="Space Type:"
						/>
					</Grid>
				)}

				<Grid item xs={12} sm={4} className={classes.topCell}>
					<SpaceLocationSelectComponent onChange={setLocation} defaultValue={location} />
				</Grid>

				<Grid item xs={12} sm={12} style={{ paddingLeft: 10 }}>
					{venueName && <Chip size="small" color="primary" label={venueName} onDelete={deleteVenue} />}
				</Grid>
			</Grid>
		</>
	);
};

export default memo(SpaceFilterComponent);
