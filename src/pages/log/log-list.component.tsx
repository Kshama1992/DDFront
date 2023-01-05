import React, { useCallback, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Theme, useMediaQuery, useTheme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import CircularProgress from '@mui/material/CircularProgress';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import LogService, { LogListItemInterface } from '@service/log.service';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			maxWidth: '100%',
			'& .MuiInput-input': {
				border: 'none',
			},
		},

		textPrimary: {
			fontSize: 15,
			paddingTop: 5,
			textDecoration: 'none',
		},
		textPrimaryLaptop: {
			fontSize: 15,
			textDecoration: 'none',
		},
		loaderWrapper: {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			background: 'rgba(255,255,255,0.31)',
			zIndex: 9,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		noItemsText: {
			width: '100%',
			textAlign: 'center',
			padding: 15,
			boxSizing: 'border-box',
		},
		tableContainer: {
			height: 'calc(100vh - 261px)',
		},
		tableHeaderCell: {
			[theme.breakpoints.only('lg')]: {
				'& > p': {
					fontSize: 12,
				},
			},
		},
		tableCell: {
			[theme.breakpoints.down('md')]: {
				width: '100%',
				display: 'inline-block',
				border: 'none',
				textAlign: 'center',
				padding: '5px 0',
				overflow: 'hidden',
				fontWeight: 500,
			},
		},
		tableRow: {
			[theme.breakpoints.down('md')]: {
				borderBottom: '1px solid rgba(0, 0, 0, 0.54)',
				display: 'inline-block',
				paddingBottom: 15,
				width: '100%',
			},
		},
		tableHead: {
			[theme.breakpoints.down('md')]: {
				display: 'none',
			},
		},
		mobileText: {
			display: 'none',
			color: '#333',
			fontWeight: 500,
			[theme.breakpoints.down('md')]: {
				display: 'block',
			},
		},
	})
);

export default function LogListComponent() {
	const classes = useStyles({});
	const logService = new LogService();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | undefined>(undefined);

	const [data, setData] = useState<LogListItemInterface[]>([]);

	const theme = useTheme();
	const isLaptop = useMediaQuery(theme.breakpoints.only('lg'));

	const loadData = useCallback(async () => {
		setIsLoading(true);
		try {
			const [items] = await logService.list();

			if (items) {
				setData(items);
			}
		} catch (e) {
			setError(e as Error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadData().then();
	}, []);

	return (
		<Paper className={classes.root}>
			<Paper>
				<Toolbar style={{ justifyContent: 'space-between' }}>
					<Typography color="inherit" variant="subtitle1" component="div">
						Application log files
					</Typography>
				</Toolbar>
			</Paper>

			<TableContainer className={classes.tableContainer}>
				<Table stickyHeader>
					<TableHead className={classes.tableHead}>
						<TableRow>
							<TableCell className={classes.tableHeaderCell}>
								<Typography>Type</Typography>
							</TableCell>

							<TableCell className={classes.tableHeaderCell}>
								<Typography>Date</Typography>
							</TableCell>

							<TableCell className={classes.tableHeaderCell}>
								<Typography>Time</Typography>
							</TableCell>

							<TableCell />
						</TableRow>
					</TableHead>

					<TableBody>
						{data &&
							data.map((type: LogListItemInterface) => (
								<TableRow key={type.name} className={classes.tableRow}>
									<TableCell scope="row" align="left" className={classes.tableCell}>
										<Typography component="p" className={isLaptop ? classes.textPrimaryLaptop : classes.textPrimary}>
											<b className={classes.mobileText}>Type: </b>
											{type.type}
										</Typography>
									</TableCell>

									<TableCell scope="row" align="left" className={classes.tableCell}>
										<Typography component="p" className={isLaptop ? classes.textPrimaryLaptop : classes.textPrimary}>
											<b className={classes.mobileText}>Date: </b>
											{type.date}
										</Typography>
									</TableCell>

									<TableCell scope="row" align="left" className={classes.tableCell}>
										<Typography component="p" className={isLaptop ? classes.textPrimaryLaptop : classes.textPrimary}>
											<b className={classes.mobileText}>Time: </b>
											{type.time}
										</Typography>
									</TableCell>

									<TableCell className={classes.tableCell}>
										<IconButton
											aria-label="view log"
											title="View log"
											size="small"
											color="primary"
											component={Link}
											to={`/dashboard/log/${type.type}/${type.name}`}
											style={{ marginRight: 15 }}
										>
											<VisibilityIcon />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
				{!isLoading && data.length === 0 && <Typography className={classes.noItemsText}>No Items</Typography>}
				{!isLoading && error && (
					<Typography className={classes.noItemsText}>
						<>Error: {error}</>
					</Typography>
				)}
			</TableContainer>

			{isLoading && (
				<div className={classes.loaderWrapper}>
					<CircularProgress />
				</div>
			)}
		</Paper>
	);
}
