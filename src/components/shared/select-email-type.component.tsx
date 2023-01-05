import React, { useState, useCallback, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import CircularProgress from '@mui/material/CircularProgress';
import EmailTemplateTypeInterface from 'dd-common-blocks/dist/interface/email-template-type.interface';
import EmailTemplateTypeService from '@service/email-template-type.service';

const useStyles = makeStyles(() =>
	createStyles({
		formControl: {
			width: '100%',
		},
		selectEmpty: {},
	})
);

export default function SelectEmailTypeComponent({
	defaultValue,
	onChange,
	showLabel = true,
	disabled = false,
}: {
	disabled?: boolean;
	showLabel?: boolean;
	defaultValue?: number | null;
	onChange?: (id: number | null) => void;
}) {
	const classes = useStyles();
	const [emailTypes, setEmailTypes] = useState<EmailTemplateTypeInterface[]>([]);
	const [value, setValue] = useState<EmailTemplateTypeInterface>();
	const [loading, setLoading] = useState(true);
	const templateTypeService = new EmailTemplateTypeService();

	const loadTypes = useCallback(async () => {
		setLoading(true);
		let [types] = await templateTypeService.list();

		// Re-rendering fix
		const allIndex = types.findIndex((i: EmailTemplateTypeInterface) => i.id === undefined);
		if (allIndex === -1) {
			types = [
				{
					name: 'All',
					id: undefined,
					createdAt: new Date(),
					updatedAt: new Date(),
					templateVariables: [],
				},
				...types,
			];
		}
		setValue(emailTypes.find((st: EmailTemplateTypeInterface) => defaultValue === st.id));
		setEmailTypes(types);
		setLoading(false);
	}, []);

	useEffect(() => {
		loadTypes().then();
	}, []);

	const handleChange = (event: SelectChangeEvent) => {
		if (onChange) onChange(Number(event.target.value));
	};

	if (loading) return <CircularProgress style={{ margin: '10px auto', display: 'block' }} />;

	return (
		<FormControl variant="standard" className={classes.formControl} disabled={disabled}>
			{showLabel && <InputLabel id="select-type-label">Email Type</InputLabel>}
			<Select
				labelId="select-type-label"
				id="select-type"
				name="emailTemplateTypeId"
				value={String((value && value.id) || emailTypes[0].id)}
				onChange={handleChange}
			>
				{emailTypes.map((i: EmailTemplateTypeInterface) => (
					<MenuItem value={i.id} key={Number(i.id) + 123}>
						{i.name}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
