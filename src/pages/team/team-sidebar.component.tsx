import React, { useContext, useEffect, useState } from 'react';
import dayjs, { extend } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DateRangePicker, DefinedRange } from 'materialui-daterange-picker';
import { ListItemText, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Link, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import TeamInterface from 'dd-common-blocks/dist/interface/team.interface';
import { TeamFiltersContext } from '@context/team-filters.context';
import { AuthContext } from '@context/auth.context';

extend(customParseFormat);

const useStyles = makeStyles(() =>
	createStyles({
		pickerWrapper: {
			// position: 'fixed',
			// width: '100%',
			// height: '100%',
			// top: 0,
			// left: 0,
		},
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
			width: '100%',
			padding: 0,
			borderTop: '1px solid #d5d5d5',
			'& .MuiList-root': {
				width: '100%',
			},
		},
	})
);

// TODO: change tabs to urls and handle date change on context level
export default function TeamSidebarFiltersComponent({
	currentTab,
	onDateChanged,
}: {
	currentTab: string;
	onDateChanged: (date: { endDate?: Date; startDate?: Date }) => void;
}) {
	const { teamId } = useParams();
	const { isSuperAdmin, authBody, isBrandAdmin } = useContext(AuthContext);
	const [dateRange, setDateRange] = useState<{ endDate?: Date; startDate?: Date; label?: string }>({
		endDate: new Date(),
		startDate: dayjs().subtract(7, 'd').toDate(),
	});
	const [open, setOpen] = useState(false);

	const classes = useStyles({});
	const theme = useTheme();
	const isPhone = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });
	const { leadingTeams } = useContext(TeamFiltersContext);

	const [expanded, setExpanded] = useState<boolean>(!isPhone);

	const getDefaultRanges = (date: Date): DefinedRange[] => [
		{
			label: 'Today',
			startDate: date,
			endDate: date,
		},
		{
			label: 'Yesterday',
			startDate: dayjs(date).subtract(1, 'd').toDate(),
			endDate: dayjs(date).subtract(1, 'd').toDate(),
		},
		{
			label: 'This Week',
			startDate: dayjs(date).startOf('week').toDate(),
			endDate: dayjs(date).endOf('week').toDate(),
		},
		{
			label: 'Last Week',
			startDate: dayjs(date).subtract(1, 'week').startOf('week').toDate(),
			endDate: dayjs(date).subtract(1, 'week').endOf('week').toDate(),
		},
		{
			label: 'Last 7 Days',
			startDate: dayjs(date).subtract(1, 'week').toDate(),
			endDate: date,
		},
		{
			label: 'This Month',
			startDate: dayjs(date).startOf('month').toDate(),
			endDate: dayjs(date).endOf('month').toDate(),
		},
		{
			label: 'Last Month',
			startDate: dayjs(date).subtract(1, 'month').startOf('month').toDate(),
			endDate: dayjs(date).subtract(1, 'month').endOf('month').toDate(),
		},
		{ label: 'All time', startDate: dayjs('1970-01-01').toDate(), endDate: dayjs().toDate() },
	];

	const toggle = () => setOpen(!open);

	const handleExpand = () => {
		setExpanded(isPhone ? !expanded : true);
	};

	const handleDateChange = (range: { endDate?: Date; startDate?: Date; label?: string }) => {
		setDateRange(range);
		setOpen(false);
	};

	useEffect(() => {
		onDateChanged(dateRange);
	}, [dateRange]);

	const isAdmin = () => {
		if (!authBody) return false;
		return isBrandAdmin || isSuperAdmin;
	};

	return (
		<>
			<Paper>
				<Accordion expanded={expanded} onChange={handleExpand}>
					<AccordionSummary expandIcon={isPhone ? <ExpandMoreIcon /> : ''}>
						<Typography>My teams</Typography>
					</AccordionSummary>
					<AccordionDetails className={classes.accDetails}>
						<List component="nav" aria-labelledby="nested-list-subheader">
							{leadingTeams.map((t: TeamInterface, k: number) => (
								<ListItem
									key={k}
									selected={String(t.id) === teamId}
									button
									component={Link}
									to={`${isAdmin() ? '/dashboard' : ''}/team/${t.id}`}
								>
									<ListItemText primary={t.name} />
								</ListItem>
							))}
						</List>
					</AccordionDetails>
				</Accordion>
			</Paper>
			{currentTab === 'activity' && (
				<Button variant="contained" color="primary" style={{ marginTop: 25, width: '100%' }} onClick={() => setOpen(!open)}>
					{dateRange.label || `${dayjs(dateRange.startDate).format('MMMM D')} - ${dayjs(dateRange.endDate).format('MMMM D')}`}
				</Button>
			)}
			<Dialog onClose={toggle} maxWidth="md" aria-labelledby="simple-dialog-title" open={open}>
				<DateRangePicker
					wrapperClassName={classes.pickerWrapper}
					open={true}
					toggle={toggle}
					onChange={handleDateChange}
					definedRanges={getDefaultRanges(new Date())}
				/>
			</Dialog>
		</>
	);
}
