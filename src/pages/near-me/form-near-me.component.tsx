import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import CircularProgress from '@mui/material/CircularProgress';
import SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import SpaceFilterInterface from 'dd-common-blocks/dist/interface/filter/space-filter.interface';
import { SnackBarContext } from '@context/snack-bar.context';
import { GeolocationData } from '@helpers/geolocate.helper';
import SpaceTypeDropDownComponent from '../space-list/space-type-dropdown.component';
import SpaceLocationSelectComponent from '../space-list/space-location-select.component';

type FormData = {
	location: GeolocationData | undefined;
	spaceType: SpaceTypeInterface | undefined;
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			'& .MuiInput-input': {
				border: 'none',
			},
			[theme.breakpoints.down('md')]: {
				'& .MuiFormLabel-root': {
					paddingLeft: 15,
					paddingTop: 15,
				},
			},
			'& .MuiFormControl-root': {
				marginTop: 5,
			},
		},
		buttonSignIn: {
			background: '#3698e3',
			color: '#fff',
			borderRadius: '4px',
			fontSize: 16,
			padding: '16px 20px',
		},
		buttonSignInLoading: {
			background: '#3698e3',
			color: '#3698e3',
			borderRadius: '4px',
			fontSize: 16,
			padding: '16px 20px',
		},
		brnWrapper: {
			margin: theme.spacing(1),
			marginTop: 0,
			position: 'relative',
			marginLeft: 0,
		},
		buttonProgress: {
			color: '#fff',
			position: 'absolute',
			top: '50%',
			left: '50%',
			marginTop: -12,
			marginLeft: -12,
		},
		signUpLink: {
			color: '#3698e3',
			textDecoration: 'none',
			padding: 0,
			cursor: 'pointer',
			'&:hover': {
				textDecoration: 'underline',
			},
			[theme.breakpoints.down('md')]: {
				marginTop: 15,
				marginBottom: 10,
				display: 'inline-block',
			},
		},
	})
);

export default function FormNearMeComponent({
	onSubmit,
	defaultValues,
	horizontal = false,
}: {
	onSubmit: (data: FormData) => void;
	defaultValues: SpaceFilterInterface | undefined;
	horizontal?: boolean;
}) {
	const { handleSubmit } = useForm<FormData>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [inited, setInited] = useState<boolean>(false);
	const { showSnackBar } = useContext(SnackBarContext);

	const classes = useStyles({});

	const [location, setLocation] = useState<GeolocationData | undefined>({
		country: '',
		longitude: 0,
		latitude: 0,
	});

	const [spaceType, setSpaceType] = useState<SpaceTypeInterface | undefined>();

	const selectSpaceType = (spaceTypeInp: SpaceTypeInterface) => {
		setSpaceType(spaceTypeInp);
	};

	const onSubmitHandler = handleSubmit(() => {
		try {
			setIsLoading(true);
			onSubmit({ spaceType, location });
		} catch (e) {
			showSnackBar((e as Error).message);
		} finally {
			setIsLoading(false);
		}
	});

	useEffect(() => {
		if (!inited && location?.country) {
			onSubmit({ spaceType, location });
			setInited(true);
		}
	}, [location]);

	return (
		<form onSubmit={onSubmitHandler} className={classes.root}>
			<Grid container spacing={3} style={{ paddingRight: 15, paddingLeft: 15, marginTop: 20 }}>
				<Grid
					item
					xs={12}
					sm={horizontal ? 5 : 6}
					style={{ border: '1px solid #e3e4e8', paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 10 }}
				>
					<SpaceTypeDropDownComponent
						onChange={selectSpaceType}
						defaultValue={defaultValues && defaultValues.spaceTypeIds ? defaultValues.spaceTypeIds : undefined}
						text={''}
					/>
				</Grid>

				<Grid item xs={12} sm={horizontal ? 5 : 6} style={{ border: '1px solid #e3e4e8', paddingTop: 0, paddingBottom: 10 }}>
					<SpaceLocationSelectComponent text={''} onChange={setLocation} defaultValue={location} />
				</Grid>

				<Grid item xs={12} sm={horizontal ? 2 : 12} style={{ padding: 0, marginTop: horizontal ? 0 : 20 }}>
					<div className={classes.brnWrapper} style={{ marginBottom: horizontal ? 0 : 8 }}>
						<Button disabled={isLoading} className={isLoading ? classes.buttonSignInLoading : classes.buttonSignIn} type="submit">
							Search
						</Button>
						{isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
					</div>
				</Grid>
			</Grid>
		</form>
	);
}
