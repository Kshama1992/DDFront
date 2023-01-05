import React, { useCallback, useContext, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import FormAmenityComponent from '@forms/form-amenity.component';
import SpaceAmenityService from '@service/space-amenity.service';
import FormSpaceStyles from '@forms/styles/form-space.styles';
import SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import AmenityInterface from 'dd-common-blocks/dist/interface/amenity.interface';
import AmenityService from '@service/amenity.service';
import SpaceTypeService from '@service/space-type.service';
import ChargeType from 'dd-common-blocks/dist/type/ChargeType';
import VenueInterface from 'dd-common-blocks/dist/interface/venue.interface';
import LinearProgress from '@mui/material/LinearProgress';
import { SnackBarContext } from '@context/snack-bar.context';
import ConfirmDialog from '@shared-components/confirm.dialog';
import SpaceAmenityInterface from 'dd-common-blocks/dist/interface/space-amenity.interface';

interface SpaceAmenityPropsInterface {
	isReadOnly: boolean;
	spaceId: number;
	spaceChargeType: ChargeType;
	venueData: VenueInterface;
	isNewSpace: boolean;
	fields: any[];
	doReload?: (items: SpaceAmenityInterface[]) => any;
}

export default function SpaceAmenityBlockComponent({
	isReadOnly,
	spaceChargeType,
	venueData,
	isNewSpace = false,
	fields,
	doReload,
	spaceId,
}: SpaceAmenityPropsInterface) {
	const classes = FormSpaceStyles({});
	const spaceAmenityService = new SpaceAmenityService();
	const amenityService = new AmenityService();
	const spaceTypeService = new SpaceTypeService();

	const [spaceAmenities, setSpaceAmenities] = useState<SpaceAmenityInterface[]>(fields || []);

	const { showSnackBar } = useContext(SnackBarContext);

	const [spaceTypeList, setSpaceTypeList] = useState<SpaceTypeInterface[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [amenityDialogVisible, setAmenityDialogVisible] = useState<boolean>(false);
	const [confirmDialogVisible, setConfirmDialogVisible] = useState<boolean>(false);
	const [editingAmenity, setEditingAmenity] = useState<number | undefined>();
	const [deletingAmenity, setDeletingAmenity] = useState<number | undefined>();
	const [amenityList, setAmenityList] = useState<AmenityInterface[]>([]);

	const loadAmenities = useCallback(async () => {
		const [list] = await amenityService.list();
		setAmenityList(list);
	}, [amenityList]);

	const loadSpaceTypes = useCallback(async () => {
		const [spaceTypes] = await spaceTypeService.list({ onlyChildren: true });
		setSpaceTypeList(spaceTypes);
	}, [spaceTypeList]);

	useEffect(() => {
		loadSpaceTypes().then();
		loadAmenities().then();
	}, []);

	const editAmenity = (index: number) => {
		setEditingAmenity(index);
		setAmenityDialogVisible(true);
	};

	const addAmenity = () => {
		setAmenityDialogVisible(true);
		setEditingAmenity(undefined);
	};

	const handleAmenitySave = async (amenity: any) => {
		if (!isNewSpace) {
			try {
				setIsLoading(true);
				const newAmenity = await spaceAmenityService.save({ ...amenity, spaceId }, amenity.id);
				if (amenity.id) {
					const index = spaceAmenities.findIndex((item) => item.id === amenity.id);
					spaceAmenities[index] = newAmenity;
					setSpaceAmenities(spaceAmenities);
					if (doReload) doReload(spaceAmenities);
				} else {
					setSpaceAmenities([...spaceAmenities, newAmenity]);
					if (doReload) doReload([...spaceAmenities, newAmenity]);
				}
				showSnackBar('Amenity saved successfully');
			} catch (e) {
				showSnackBar(e.message);
			} finally {
				setIsLoading(false);
			}
		} else {
			if (typeof editingAmenity !== 'undefined') {
				const cloneArr = spaceAmenities;
				cloneArr[editingAmenity] = amenity;
				setSpaceAmenities(cloneArr);
				if (doReload) doReload(cloneArr);
			} else {
				setSpaceAmenities([...spaceAmenities, amenity]);
				if (doReload) doReload([...spaceAmenities, amenity]);
			}
		}
		setAmenityDialogVisible(false);
	};

	const showDeleteConfirm = (index: number) => {
		setDeletingAmenity(index);
		setConfirmDialogVisible(true);
	};

	const closeDeleteConfirm = () => {
		setDeletingAmenity(undefined);
		setConfirmDialogVisible(false);
	};

	const handleDeleteAmenity = async () => {
		if (!isNewSpace) {
			try {
				setIsLoading(true);
				await spaceAmenityService.delete(fields[deletingAmenity].id);
				if (doReload) doReload(spaceAmenities.filter((s) => s.id !== fields[deletingAmenity].id));
				setSpaceAmenities(spaceAmenities.filter((s) => s.id !== fields[deletingAmenity].id));
				showSnackBar('Amenity deleted successfully');
			} catch (e) {
				showSnackBar(e.message);
			} finally {
				setIsLoading(false);
				closeDeleteConfirm();
			}
		} else {
			if (doReload) doReload(spaceAmenities.filter((_, i) => i !== deletingAmenity));
			setSpaceAmenities(spaceAmenities.filter((_, i) => i !== deletingAmenity));
			closeDeleteConfirm();
		}
	};

	const closeAmenityDialog = () => {
		setAmenityDialogVisible(false);
		setEditingAmenity(undefined);
	};

	const renderAmenities = () => {
		if (spaceAmenities.length === 0) return <Typography>No amenities</Typography>;

		return spaceAmenities.map((a: any, index: number) => (
			<Grid item xs={3} key={index} className={classes.amenityBtnWrap}>
				<Button
					disabled={isReadOnly}
					startIcon={<CheckIcon className={classes.amenityIcon} />}
					className={classes.amenityBtn}
					onClick={() => editAmenity(index)}
				>
					<Typography style={{ fontSize: 13 }}>{a.name || a.amenity.name}</Typography>
				</Button>
				<IconButton disabled={isReadOnly} color="secondary" onClick={() => showDeleteConfirm(index)} size="large">
					<CloseIcon color="secondary" />
				</IconButton>
			</Grid>
		));
	};

	return (
		<>
			<div id="amenities">
				<Typography className={classes.tabTitleWrapper}>
					Include Amenities
					<Button color="primary" disabled={isReadOnly} startIcon={<AddIcon />} size="small" onClick={addAmenity}>
						Add new
					</Button>
				</Typography>

				<Grid container spacing={1} className={classes.container}>
					{isLoading && <LinearProgress />}
					{renderAmenities()}
				</Grid>
			</div>
			<Dialog open={amenityDialogVisible} onClose={closeAmenityDialog}>
				<DialogTitle className={classes.dialogTitle}>
					{typeof editingAmenity !== 'undefined' && fields[editingAmenity] ? 'Edit' : 'Add New'} Amenity
				</DialogTitle>
				<DialogContent>
					<FormAmenityComponent
						venueData={venueData}
						spaceChargeType={spaceChargeType}
						onSave={handleAmenitySave}
						onCancel={closeAmenityDialog}
						initialValues={typeof editingAmenity !== 'undefined' && fields[editingAmenity] ? fields[editingAmenity] : undefined}
					/>
				</DialogContent>
			</Dialog>

			<ConfirmDialog
				text={`Are you sure you want to delete amenity?`}
				open={confirmDialogVisible}
				isLoading={isLoading}
				onClose={closeDeleteConfirm}
				action={handleDeleteAmenity}
			/>
		</>
	);
}
