import React, { useContext, useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import { AuthContext } from '@context/auth.context';
import { EmailFiltersContext } from '@context/email-filters.context';
import SelectEmailTypeComponent from '@shared-components/select-email-type.component';
import AutocompleteAsync from '@forms/elements/autocomplete-async.component';
import BrandFilter from 'dd-common-blocks/dist/interface/filter/brand-filter.interface';

const useStyles = makeStyles(() =>
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

export default function EmailSidebarFiltersComponent() {
	const classes = useStyles({});
	const theme = useTheme();
	const isPhone = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });
	const { isSuperAdmin, authBody, isBrandAdmin } = useContext(AuthContext);

	const { emailFilters, setEmailFilters } = useContext(EmailFiltersContext);
	const [expanded, setExpanded] = useState<boolean>(!isPhone);

	const handleExpand = () => {
		setExpanded(isPhone ? !expanded : true);
	};

	const setSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmailFilters({ type: 'searchString', payload: e.target.value });
	};

	const setBrandId = (id: number | null) => {
		setEmailFilters({ type: 'brandId', payload: id || null });
	};

	const setEmailTypeId = (id: number | null) => {
		setEmailFilters({ type: 'emailTemplateTypeId', payload: id || null });
	};

	const brandIds = isSuperAdmin ? [] : [9999, Number(authBody?.brandId)];

	return (
		<Paper>
			<Accordion expanded={expanded} onChange={handleExpand}>
				<AccordionSummary expandIcon={isPhone ? <ExpandMoreIcon /> : ''}>
					<Typography>FILTER BY</Typography>
				</AccordionSummary>
				<AccordionDetails className={classes.accDetails}>
					<Grid container spacing={0} style={{ paddingBottom: 15 }}>
						<Grid item xs={12} className={classes.filterItem}>
							<TextField
								label="Search by name"
								value={emailFilters.searchString || ''}
								className={classes.searchField}
								onChange={setSearch}
								fullWidth
								variant="standard"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon />
										</InputAdornment>
									),
								}}
							/>
						</Grid>

						<Grid item xs={12} className={classes.filterItem}>
							<AutocompleteAsync
								type="brand"
								label="Brand"
								variant="standard"
								showAll
								filter={{ onlyIds: [brandIds] } as BrandFilter}
								shrink={false}
								disabled={isBrandAdmin}
								defaultValue={Number(emailFilters.brandId)}
								onChange={setBrandId}
							/>
						</Grid>

						<Grid item xs={12} className={classes.filterItem}>
							<SelectEmailTypeComponent defaultValue={Number(emailFilters.emailTemplateTypeId)} onChange={setEmailTypeId} />
						</Grid>
					</Grid>
				</AccordionDetails>
			</Accordion>
		</Paper>
	);
}
