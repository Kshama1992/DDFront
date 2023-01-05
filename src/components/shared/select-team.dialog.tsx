import React, { useCallback, useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import TeamInterface from 'dd-common-blocks/dist/interface/team.interface';
import TeamService from '@service/team.service';

export interface SelectTeamDialogProps {
	classes?: Record<'paper', string>;
	id?: string;
	keepMounted?: boolean;
	teamLeadId: number | string;
	value?: string;
	open: boolean;
	onClose: (value?: string) => void;
}

export default function SelectTeamDialog(props: SelectTeamDialogProps) {
	const { onClose, teamLeadId, value: valueProp, open, ...other } = props;
	const [value, setValue] = useState(valueProp);
	const radioGroupRef = useRef<HTMLElement>(null);

	const teamService = new TeamService();
	const [teams, setTeams] = useState<TeamInterface[]>([]);

	const loadTeams = useCallback(async () => {
		try {
			const [loadedTeams] = await teamService.list({ limit: 130, teamLeadId });
			setTeams(loadedTeams);
		} catch (e) {
			console.error(e);
		}
	}, []);

	useEffect(() => {
		loadTeams().then();
	}, []);

	const handleCancel = () => {
		onClose();
	};

	const handleOk = () => {
		onClose(value);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue((event.target as HTMLInputElement).value);
	};

	return (
		<Dialog disableEscapeKeyDown maxWidth="xs" aria-labelledby="team-dialog-title" open={open} {...other}>
			<DialogTitle id="team-dialog-title">Select team</DialogTitle>
			<DialogContent dividers>
				<RadioGroup ref={radioGroupRef} aria-label="team" name="team" value={value} onChange={handleChange}>
					{teams.map((team, k) => (
						<FormControlLabel value={String(team.id)} key={k} control={<Radio />} label={team.name} />
					))}
				</RadioGroup>
			</DialogContent>
			<DialogActions>
				<Button autoFocus onClick={handleCancel} color="primary">
					Cancel
				</Button>
				<Button onClick={handleOk} color="primary">
					Ok
				</Button>
			</DialogActions>
		</Dialog>
	);
}
