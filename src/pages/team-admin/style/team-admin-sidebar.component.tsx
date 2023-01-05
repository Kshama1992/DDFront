import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

const TeamAdminSidebarComponentStyles = makeStyles(() =>
	createStyles({
		headTitle: {
			paddingTop: 15,
			paddingLeft: 20,
			marginBottom: 25,
		},
		filterItem: {
			margin: '5px 20px',
		},
		searchField: {
			'& .MuiInputBase-root': {
				background: 'none',
			},
			'& .MuiInput-input': {
				border: 'none',
			},
		},
		accDetails: {
			padding: 0,
			borderTop: '1px solid #d5d5d5',
		},
	})
);

export default TeamAdminSidebarComponentStyles;
