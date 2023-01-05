import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';
import SpaceTypeService from '@service/space-type.service';

const useStyles = makeStyles((theme) =>
	createStyles({
		root: {
			paddingLeft: 15,
			'& .MuiInputLabel-formControl': {
				transform: 'translate(0, 1.5px) scale(0.75)',
				transformOrigin: 'top left',
			},
		},
		expandIcon: {
			color: theme.palette.primary.main,
		},
		input: {
			'& .MuiInput-root ': {
				// paddingLeft: 15,
				paddingTop: 5,
			},
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
				marginTop: -10,
				textTransform: 'uppercase',
			},
			'& label + div': {
				background: 'none',
				margin: '15px 0 0 0',
			},
			'& input': {
				border: 'none',
				fontSize: 16,
				padding: 12,
			},
		},
		option: {
			fontSize: 15,
			'& > span': {
				marginRight: 10,
				fontSize: 18,
			},
		},
		optionIcon: {
			marginBottom: -5,
			marginRight: 5,
		},
	})
);

interface Props {
	text?: string;
	onChange: (i: SpaceTypeInterface) => any;
	defaultValue?: number[] | undefined;
	showIcons?: boolean;
	valuesArray?: SpaceTypeInterface[];
}

const SpaceTypeDropDownComponent = ({ text = 'I’m Looking for:', onChange, defaultValue, showIcons = true, valuesArray }: Props) => {
	const classes = useStyles({});
	const [selectedValue, setSelectedValue] = useState<SpaceTypeInterface>();
	const [types, setTypes] = useState<SpaceTypeInterface[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const spaceTypeService = new SpaceTypeService();

	const loadSpaces = useCallback(async () => {
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

		let typesArray: SpaceTypeInterface[] = valuesArray ? [all, ...valuesArray] : [all];

		if (!valuesArray) {
			const [typesResp] = await spaceTypeService.list({ withChildren: true, withCache: true });
			typesArray = [all, ...typesResp];
		}
		setTypes(typesArray);
		const someVal = typesArray.find((st) => defaultValue && defaultValue.includes(Number(st.id)));
		if (!someVal) {
			// seems child type selected. try to find parent.
			const parent = typesArray.find((t: SpaceTypeInterface) =>
				t.children?.some((stc) => defaultValue && defaultValue.includes(Number(stc.id)))
			);

			if (parent && parent.children) {
				setSelectedValue(parent);
				onChange(parent);
			} else {
				setSelectedValue(typesArray[0]);
				onChange(typesArray[0]);
			}
		} else {
			setSelectedValue(someVal);
			onChange(someVal);
		}
		setIsLoading(false);
	}, [valuesArray]);

	useEffect(() => {
		loadSpaces().then();
	}, [valuesArray]);

	useEffect(() => {
		if (defaultValue) {
			const someVal = types.find((st) => defaultValue && defaultValue.includes(Number(st.id)));
			if (!someVal) {
				// seems child type selected. try to find parent.
				const parent = types.find((t: SpaceTypeInterface) =>
					t.children?.some((stc) => defaultValue && defaultValue.includes(Number(stc.id)))
				);

				if (parent && parent.children) {
					setSelectedValue(parent);
					onChange(parent);
				} else {
					setSelectedValue(types[0]);
					onChange(types[0]);
				}
			} else {
				setSelectedValue(someVal);
				onChange(someVal);
			}
		}
	}, [defaultValue]);

	const handleSpaceTypeChange = (e: ChangeEvent<any>, value: SpaceTypeInterface) => {
		setSelectedValue(value);
		onChange(value);
	};

	if (isLoading) return <CircularProgress style={{ margin: '10px auto', display: 'block' }} />;

	return (
		<Autocomplete
			options={types}
			classes={{
				root: classes.root,
				option: classes.option,
			}}
			disableClearable
			value={selectedValue}
			getOptionLabel={(option: SpaceTypeInterface) => option.name}
			autoComplete
			includeInputInList
			onChange={handleSpaceTypeChange}
			popupIcon={<ExpandMoreIcon className={classes.expandIcon} />}
			renderOption={(props, option) => (
				<li {...props}>
					<Typography variant="caption" style={{ fontSize: 13 }}>
						{showIcons && <LocationOnIcon className={classes.optionIcon} style={{ color: option.color || '#2196f3' }} />} {option.name}
					</Typography>
				</li>
			)}
			renderInput={(params) => (
				<TextField
					{...params}
					label={text}
					className={classes.input}
					placeholder="All"
					variant="standard"
					fullWidth
					inputProps={{
						...params.inputProps,
						autoComplete: 'disabled', // disable autocomplete and autofill
					}}
				/>
			)}
		/>
	);
};

export default SpaceTypeDropDownComponent;
