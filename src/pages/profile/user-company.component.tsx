import React, { useEffect, useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import CompanyInterface from 'dd-common-blocks/dist/interface/company.interface';
import UserService from '@service/user.service';

const useStyles = makeStyles(() =>
	createStyles({
		listItem: {
			paddingLeft: 0,
		},
		listItemText: {
			'& p': {
				fontSize: 12,
				lineHeight: '12px',
				letterSpacing: 0,
			},
		},
	})
);

export default function UserCompanyComponent({ refresh = false }: { refresh?: boolean }) {
	const classes = useStyles({});
	const userService = new UserService();

	const [loading, setLoading] = useState<boolean>(true);
	const [companies, setCompanies] = useState<CompanyInterface[]>([]);
	const { id } = useParams();

	const loadCompanies = useCallback(async () => {
		if (id === '0') {
			setLoading(false);
			return;
		}
		try {
			const items = await userService.getCompanies(id);
			setCompanies(items);
			setLoading(false);
		} catch (e) {
			console.error(e);
		}
	}, [id, refresh]);

	useEffect(() => {
		loadCompanies().then();
	}, [refresh]);

	if (loading) return <CircularProgress />;

	if (!loading && !companies.length) return <Typography>No companies</Typography>;

	return (
		<List>
			{companies.map((c: CompanyInterface) => (
				<ListItem component={Link} to={`/community/companies/${c.id}`} key={c.id} className={classes.listItem} alignItems="flex-start">
					<ListItemAvatar>
						<Avatar alt={c.name} src={c.photos.length ? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${c.photos[0].url}` : ''} />
					</ListItemAvatar>
					<ListItemText className={classes.listItemText} primary={c.name} secondary={c.brand ? c.brand.name : ''} />
				</ListItem>
			))}
		</List>
	);
}
