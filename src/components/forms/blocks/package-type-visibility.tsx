import React, { useCallback, useEffect, useState } from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Checkbox from '@mui/material/Checkbox';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SpaceTypeInterface from 'dd-common-blocks/dist/interface/space-type.interface';
import SpaceTypeService from '@service/space-type.service';
import CustomScrollbar from '@shared-components/custom-scrollbar.component';
import SpaceTypeLogicType from 'dd-common-blocks/dist/type/SpaceTypeLogicType';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		spaceTypeItemWrap: {
			[theme.breakpoints.down('md')]: {
				'& .MuiListItemSecondaryAction-root': {
					position: 'static',
					marginTop: 30,
				},
			},
		},
		label: {
			fontWeight: 500,
			marginLeft: 0,
			fontSize: 12,
			textTransform: 'none',
		},
	})
);

export default function PackageTypeVisibilityBlock({
	initialPackagesList = [],
	isReadOnly = false,
	onSpaceTypesChange,
}: {
	initialPackagesList: SpaceTypeInterface[];
	isReadOnly?: boolean | undefined;
	onSpaceTypesChange: (types: SpaceTypeInterface[]) => void;
}) {
	const classes = useStyles({});
	const spaceTypeService = new SpaceTypeService();

	const [spaceTypeList, setSpaceTypeList] = useState<SpaceTypeInterface[]>([]);
	const [packageSpaceTypes, setPackageSpaceTypes] = useState<SpaceTypeInterface[]>(initialPackagesList);

	const loadSpaceTypes = useCallback(async () => {
		const [spaceTypes] = await spaceTypeService.list({ onlyChildren: true });
		setSpaceTypeList(spaceTypes.filter((t) => t.logicType !== SpaceTypeLogicType.INFO));
	}, [spaceTypeList]);

	const getIsPackageSelected = (spaceTypeId: number | undefined) => {
		const founded = packageSpaceTypes.find((p) => Number(p.id) === Number(spaceTypeId));
		return typeof founded !== 'undefined';
	};

	const handlePackageTypeSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = event.target;
		const spaceTypeId = Number(name.split('_').pop());
		if (checked) {
			const newSpaceType = spaceTypeList.find((st) => st.id === spaceTypeId);
			if (newSpaceType) setPackageSpaceTypes([...packageSpaceTypes, newSpaceType]);
		} else {
			const index = packageSpaceTypes.findIndex((pst) => pst.id === spaceTypeId);
			const cloneArr = packageSpaceTypes;
			cloneArr.splice(index, 1);
			setPackageSpaceTypes([...cloneArr]);
		}
	};

	useEffect(() => {
		loadSpaceTypes().then();
	}, []);

	useEffect(() => {
		onSpaceTypesChange(packageSpaceTypes);
	}, [packageSpaceTypes]);

	return (
		<Grid item xs={12}>
			<Typography variant="body1" className={classes.label}>
				Package Types visibility
			</Typography>
			<Divider />

			<CustomScrollbar autoHide style={{ height: 300 }}>
				<List className={classes.spaceTypeItemWrap}>
					{spaceTypeList.map((spaceType: SpaceTypeInterface) => (
						<ListItem key={spaceType.id} role={undefined} dense button disabled={isReadOnly}>
							<ListItemIcon>
								<Checkbox
									edge="start"
									name={`spaceTypeId_${String(spaceType.id)}`}
									checked={getIsPackageSelected(spaceType.id)}
									tabIndex={-1}
									onChange={handlePackageTypeSelect}
									disableRipple
									inputProps={{ 'aria-labelledby': String(spaceType.id) }}
								/>
							</ListItemIcon>
							<ListItemText id={String(spaceType.id)} primary={spaceType.name} />
						</ListItem>
					))}
				</List>
			</CustomScrollbar>
			<Divider />
		</Grid>
	);
}
