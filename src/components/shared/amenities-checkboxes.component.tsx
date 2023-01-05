import React, { useState, memo } from 'react';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
import WifiIcon from '@mui/icons-material/Wifi';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LocalParkingOutlinedIcon from '@mui/icons-material/LocalParkingOutlined';
import AllInclusiveOutlinedIcon from '@mui/icons-material/AllInclusiveOutlined';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const useStyles = makeStyles(() =>
	createStyles({
		amenitiesDesktop: {
			paddingLeft: 10,
		},
		checkboxFilterItem: {
			display: 'flex',
			alignItems: 'center',
			width: 165,
			marginLeft: -15,
			marginRight: 15,
			minHeight: 48,
			textDecoration: 'none',
			'&:hover': {
				textDecoration: 'underline',
			},
		},
		checkboxRadioIcon: {
			color: '#3698e3',
			fontSize: 22,
		},
		checkboxFilterIcon: {
			color: '#3698e3',
			fontSize: 22,
			marginLeft: 5,
			marginTop: 9,
			marginRight: 5,
		},
		checkboxFilterText: {
			marginBottom: 5,
			fontSize: 14,
			position: 'relative',
			top: -5,
			display: 'inline',
		},
	})
);

const getIcon = (amenityAlias: string, iconStyles: any, iconColor = '#2F96E6') => {
	switch (amenityAlias) {
		case 'phone':
			return <CallOutlinedIcon className={iconStyles} style={{ color: iconColor }} />;
		case 'wifi':
			return <WifiIcon className={iconStyles} style={{ color: iconColor }} />;
		case 'conference':
			return <QueryBuilderOutlinedIcon className={iconStyles} style={{ color: iconColor }} />;
		case 'mail':
			return <MailOutlinedIcon className={iconStyles} style={{ color: iconColor }} />;
		case 'kitchen':
			return <LocalCafeOutlinedIcon className={iconStyles} style={{ color: iconColor }} />;
		case 'printing':
			return <PrintOutlinedIcon className={iconStyles} style={{ color: iconColor }} />;
		case 'coworking':
			return <PeopleAltOutlinedIcon className={iconStyles} style={{ color: iconColor }} />;
		case 'apps':
			return <PhoneIphoneOutlinedIcon className={iconStyles} style={{ color: iconColor }} />;
		case 'storage':
			return <LockOutlinedIcon className={iconStyles} style={{ color: iconColor }} />;
		case 'parking':
			return <LocalParkingOutlinedIcon className={iconStyles} style={{ color: iconColor }} />;
		case '247access':
			return <AllInclusiveOutlinedIcon className={iconStyles} style={{ color: iconColor }} />;
		default:
			return <PinDropOutlinedIcon className={iconStyles} style={{ color: iconColor }} />;
	}
};
const AmenitiesCheckboxesComponent = ({ spaceFilters, onChange }: { onChange: (amenityId: number) => void; spaceFilters?: any }) => {
	const classes = useStyles({});
	const [amenitiesList] = useState(() => [
		{
			name: 'Wifi',
			alias: 'wifi',
			id: 1,
		},
		{
			name: 'Phone',
			alias: 'phone',
			id: 2,
		},
		{
			name: 'Conference',
			alias: 'conference',
			id: 3,
		},
		{
			name: 'Mail',
			alias: 'mail',
			id: 4,
		},
		{
			name: 'Kitchen',
			alias: 'kitchen',
			id: 5,
		},
		{
			name: 'Printing',
			alias: 'printing',
			id: 6,
		},
		{
			name: 'Coworking',
			alias: 'coworking',
			id: 7,
		},
		{
			name: 'Apps',
			alias: 'apps',
			id: 8,
		},
		{
			name: 'Storage',
			alias: 'storage',
			id: 9,
		},
		{
			name: 'Parking',
			alias: 'parking',
			id: 10,
		},
		{
			name: '24/7 Access',
			alias: '247access',
			id: 11,
		},
		{
			name: '24/7 Access',
			alias: '247access',
			id: 12,
		},
	]);

	const toggleAmenity = (amenityId: number) => () => {
		onChange(amenityId);
		// setSpaceFilters({ type: 'amenity', payload: amenityId });
	};

	return (
		<FormGroup row className={classes.amenitiesDesktop}>
			<Grid container spacing={0}>
				{amenitiesList.map((amenity) => (
					<Grid item xs={6} md={3} key={amenity.id} className={classes.checkboxFilterItem}>
						<FormControlLabel
							control={
								<Checkbox
									color="primary"
									checked={spaceFilters?.amenities?.indexOf(amenity.id) > -1}
									onChange={toggleAmenity(amenity.id)}
									icon={<RadioButtonUncheckedOutlinedIcon className={classes.checkboxRadioIcon} />}
									checkedIcon={<RadioButtonCheckedOutlinedIcon className={classes.checkboxRadioIcon} />}
								/>
							}
							label={
								<>
									{getIcon(amenity.alias, classes.checkboxFilterIcon, '#2F96E6')}
									<Typography className={classes.checkboxFilterText}>{amenity.name}</Typography>
								</>
							}
						/>
					</Grid>
				))}
			</Grid>
		</FormGroup>
	);
};

export default memo(AmenitiesCheckboxesComponent);
