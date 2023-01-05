import React, { useCallback, useContext, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LinearProgress from '@mui/material/LinearProgress';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import CompanyInterface from 'dd-common-blocks/dist/interface/company.interface';
import ApprovalStatus from 'dd-common-blocks/dist/type/ApprovalStatus';
import CompanyMemberInterface from 'dd-common-blocks/dist/interface/company-member.interface';
import IsMemberHelper from '@helpers/company/is-member.helper';
import { AuthContext } from '@context/auth.context';
import CompanyService from '@service/company.service';

interface SelectCompanyDialogComponentProps {
	userId: number;
	brandId?: number;
	open: boolean;
	onClose: () => any;
	onCancel: () => any;
}

const useStyles = makeStyles(() =>
	createStyles({
		progress: {
			width: '100%',
		},
		avatar: { marginRight: 15 },
		companyWhereUserMember: {},
		memberStatus: {
			display: 'inline-block',
			height: 20,
			marginLeft: 13,
		},
	})
);

export default function SelectCompanyDialogComponent({ open, userId, brandId, onClose, onCancel }: SelectCompanyDialogComponentProps) {
	const classes = useStyles({});
	const { authBody } = useContext(AuthContext);

	const companyService = new CompanyService();

	const [isLoading, setIsloading] = useState<boolean>(true);
	const [companies, setCompanies] = useState<CompanyInterface[]>([]);

	const loadCompanies = useCallback(async () => {
		try {
			const [loadedCompanies] = await companyService.list({ brandId, limit: 150 });
			setCompanies(loadedCompanies);
		} catch (e) {
			console.error(e);
		} finally {
			setIsloading(false);
		}
	}, []);

	useEffect(() => {
		loadCompanies().then();
	}, []);

	const setUserCompany = async (company: CompanyInterface) => {
		const array = companies;

		const companyIndex = array.findIndex((c: CompanyInterface) => c.id === company.id);

		if (!IsMemberHelper(company, userId)) {
			const member = await companyService.addMember(company.id, userId);
			array[companyIndex].members.push(member);
		} else {
			await companyService.deleteMember(company.id, userId);
			const memberIndex = companies[companyIndex].members.findIndex((m: CompanyMemberInterface) => m.userId === userId);
			array[companyIndex].members.splice(memberIndex, 1);
		}
		setCompanies([...array]);
	};

	const handleClose = () => {
		onClose();
	};

	const memberStatus = (company: CompanyInterface) => {
		if (typeof company.members === 'undefined') return '';

		const member = company.members.find((u: CompanyMemberInterface) => u.userId === userId);

		if (typeof member === 'undefined') return '';

		const style = member.status === ApprovalStatus.PENDING ? { backgroundColor: 'orange' } : { backgroundColor: 'green' };

		return <>{IsMemberHelper(company, userId) && <Chip className={classes.memberStatus} style={style} label={member.status} />}</>;
	};

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Please select company from list</DialogTitle>
			<DialogContent>
				{isLoading && <LinearProgress className={classes.progress} />}
				{!isLoading && (
					<List>
						{companies &&
							companies.map((c: CompanyInterface) => (
								<ListItem className={IsMemberHelper(c, userId) ? classes.companyWhereUserMember : ''} key={c.id}>
									<Avatar
										alt={c.name}
										className={classes.avatar}
										src={c.photos.length ? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${c.photos[0].url}` : ''}
									/>
									<ListItemText
										primary={
											<Typography>
												{c.name}{' '}
												{c.createdBy && (
													<small style={{ fontSize: 12, textDecoration: 'underline' }}>
														by {c.createdBy.firstname} {c.createdBy.lastname}
													</small>
												)}
												{memberStatus(c)}
												{userId === c.createdById && (
													<Chip
														component="span"
														className={classes.memberStatus}
														label={`${
															authBody?.id !== userId ? `${c.createdBy.firstname} ${c.createdBy.lastname}` : 'You'
														} created this company`}
													/>
												)}
											</Typography>
										}
										secondary={c.venue ? c.venue.name : ''}
									/>
									<ListItemSecondaryAction>
										{userId !== c.createdById && (
											<Switch onChange={() => setUserCompany(c)} checked={IsMemberHelper(c, userId)} />
										)}
									</ListItemSecondaryAction>
								</ListItem>
							))}
					</List>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={() => onCancel()} color="primary">
					Cancel
				</Button>
				<Button onClick={handleClose} color="primary">
					Ok
				</Button>
			</DialogActions>
		</Dialog>
	);
}
