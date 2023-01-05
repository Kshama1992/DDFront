import React from 'react';
import pluralize from 'pluralize';
import dayjs from 'dayjs';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Controller } from 'react-hook-form';
import Select from '@mui/material/Select';

export default function SelectRoundHoursComponent({
	label = 'Minimum Booking Period',
	showLabel = true,
	disabled = false,
	control,
	name = 'roundHours',
}: {
	label?: string;
	disabled?: boolean;
	showLabel?: boolean;
	control: any;
	name?: string;
}) {
	return (
		<FormControl fullWidth>
			{showLabel && (
				<InputLabel shrink id="roundHours">
					{label}
				</InputLabel>
			)}
			<Controller
				name={name}
				control={control}
				render={({ field }) => (
					<Select {...field} id={`${name}_`} labelId={name} disabled={disabled} variant="outlined">
						{[...Array(48)].map((v, k) => {
							const time = dayjs()
								.startOf('day')
								.add(k * 0.5, 'h')
								.format('HH:mm');
							if (k === 0)
								return (
									<MenuItem value={0} key={0}>
										None
									</MenuItem>
								);
							return (
								<MenuItem key={k} value={k * 0.5}>
									{time} {pluralize('Hour', k * 0.5, false)}
								</MenuItem>
							);
						})}
					</Select>
				)}
			/>
		</FormControl>
	);
}
