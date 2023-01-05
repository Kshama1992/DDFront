import React, { memo, useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import { BadgeProps, Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import makeStyles from '@mui/styles/makeStyles';
import Badge from '@mui/material/Badge';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import ButtonGroup from '@mui/material/ButtonGroup';
import GroupInterface from 'dd-common-blocks/dist/interface/group.interface';
import GroupMemberInterface from 'dd-common-blocks/dist/interface/group-member.interface';
import ApprovalStatus from 'dd-common-blocks/dist/type/ApprovalStatus';
import { AuthContext } from '@context/auth.context';
import IsMemberOwnerHelper from '@helpers/company/is-member-owner.helper';
import IsMemberPendingHelper from '@helpers/company/is-member-pending.helper';
import { SnackBarContext } from '@context/snack-bar.context';
import AvatarComponent from '@shared-components/avatar.component';
import UploadFileHelper from '@helpers/file-upload.helper';
import ImageEditor from '@shared-components/image-editor.component';
import GroupService from '@service/group.service';
import AutocompleteAsync from '@forms/elements/autocomplete-async.component';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		middleSpacer: {
			margin: '30px 0',
			width: '100%',
		},
		fieldTitle: {
			fontWeight: 600,
			textTransform: 'uppercase',
			fontSize: 15,
			marginTop: 10,
			marginBottom: 10,
		},
		myCompanyEdit: {
			marginLeft: 15,
			marginBottom: 2,
		},
		fieldValue: {
			fontSize: 15,
		},
		savingProgress: {
			position: 'absolute',
			width: '100%',
			top: 0,
			left: 0,
		},
		memberWrapper: {
			textAlign: 'center',
			marginTop: 15,
			marginBottom: 15,
			position: 'relative',
		},
		memberAvatar: {
			width: 120,
			height: 120,
			margin: '0 auto',
			marginBottom: 10,
		},
		memberLink: {
			display: 'inline-block',
			textDecoration: 'none',
			color: theme.palette.primary.main,
			fontWeight: 400,
			width: '100%',
		},
		memberActionLeft: {
			position: 'absolute',
			bottom: 30,
			left: 20,
		},
		memberActionRight: {
			position: 'absolute',
			bottom: 30,
			right: 20,
		},
		serviceItem: {
			marginRight: 10,
		},
		avatar: {
			cursor: 'pointer',
		},
		uploadInput: {
			display: 'none',
		},
	})
);

function CommunityGroupInfoComponent({ data, onSaved }: { data: GroupInterface; onSaved: () => void }) {
	const { id } = useParams();

	const groupService = new GroupService();

	const classes = useStyles({});
	const { authBody, isSuperAdmin, isBrandAdmin } = useContext(AuthContext);
	const { showSnackBar } = useContext(SnackBarContext);
	const [isEditMode, setIsEditMode] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [brandId, setBrandId] = useState<number | null>(data ? data.brandId : null);

	const [image, setImage] = useState<string>(data.photos.length ? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${data.photos[0].url}` : '');
	const [uploadImage, setUploadImage] = useState<string>('');
	const [imageEditVisible, setImageEditVisible] = useState<boolean>(false);

	const methods = useForm();
	const { handleSubmit, control } = methods;

	const onSubmit = async (userData: any) => {
		try {
			const newData = userData;
			setIsSaving(true);

			if (brandId !== data.brandId) {
				newData.brandId = brandId;
			}

			// eslint-disable-next-line prefer-destructuring
			newData.photos = data.photos[0];
			if (uploadImage) {
				newData.photos = [];
				newData.uploadAttachments = [uploadImage];
			}

			await groupService.save(newData, id);
			onSaved();
			setIsSaving(false);
			setIsEditMode(false);
		} catch (e) {
			const { message } = e as Error;
			showSnackBar(message);
		} finally {
			setIsSaving(false);
		}
	};

	const changeBrand = (changingBrandId: any) => {
		setBrandId(changingBrandId);
	};

	const showControls = isBrandAdmin || isSuperAdmin || authBody?.id === data.createdById;

	const approveMember = async (membership: GroupMemberInterface) => {
		try {
			const clone = data;
			await groupService.approveMember(data.id, membership.userId);
			const memberIndex = clone.members.findIndex((m) => m.id === membership.id);
			clone.members[memberIndex].status = ApprovalStatus.APPROVED;
			onSaved();
		} catch (e) {
			console.error(e);
		}
	};

	const deleteMember = async (membership: GroupMemberInterface) => {
		try {
			const clone = data;
			await groupService.deleteMember(data.id, membership.userId);
			const memberIndex = clone.members.findIndex((m) => m.id === membership.id);
			clone.members.splice(memberIndex, 1);
			onSaved();
		} catch (e) {
			console.error(e);
		}
	};

	const renderMember = (m: GroupMemberInterface, i: number) => {
		if (!m.member) return <></>;
		const badgeProps: BadgeProps = {
			children: (
				<AvatarComponent
					url={`/community/members/${m.member.id}`}
					src={m.member.photo ? `${process.env.RAZZLE_RUNTIME_MEDIA_URL}${m.member.photo.url}` : undefined}
					altText={`${m.member.firstname} ${m.member.lastname}`}
				/>
			),
			color: 'default',
			badgeContent: '',
		};

		if (IsMemberOwnerHelper(data, m.member.id)) {
			badgeProps.badgeContent = 'owner';
			badgeProps.color = 'primary';
		}

		if (IsMemberPendingHelper(data, m.member.id)) {
			badgeProps.badgeContent = 'pending';
			badgeProps.color = 'error';
		}

		return (
			<Grid item sm={3} xs={6} key={i} className={classes.memberWrapper}>
				<Badge {...badgeProps} />

				{showControls && m.member.id !== data.createdById && (
					<>
						{IsMemberPendingHelper(data, m.member.id) && (
							<IconButton
								onClick={() => approveMember(m)}
								aria-label="approve"
								color="primary"
								title="Approve"
								className={classes.memberActionLeft}
								size="large"
							>
								<DoneIcon />
							</IconButton>
						)}
						<IconButton
							onClick={() => deleteMember(m)}
							aria-label="delete"
							color="secondary"
							title="Delete"
							className={classes.memberActionRight}
							size="large"
						>
							<ClearIcon />
						</IconButton>
					</>
				)}
				<Typography component={Link} to={`/community/members/${m.member.id}`} className={classes.memberLink}>
					{m.member.firstname} {m.member.lastname}
				</Typography>
			</Grid>
		);
	};

	const handleImageSave = (base64: string) => {
		setImage(base64);
		setImageEditVisible(false);
	};

	const onUploadFile = async (event: any) => {
		const base64: string = await UploadFileHelper(event);
		setUploadImage(base64);
		setImageEditVisible(true);
	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', padding: 45, boxSizing: 'border-box' }}>
				{isSaving && <LinearProgress className={classes.savingProgress} />}
				<Grid container spacing={3}>
					<Grid item md={3} xs={12} xl={2}>
						{!isEditMode && <AvatarComponent size="lg" src={image} altText={data.name} />}
						{isEditMode && (
							<>
								<input
									accept="image/*"
									name="uploadAttachments[]"
									className={classes.uploadInput}
									id="contained-button-file"
									type="file"
									onChange={onUploadFile}
								/>
								<label htmlFor="contained-button-file">
									<AvatarComponent size="lg" src={image} altText={data.name} className={classes.avatar} />
								</label>
							</>
						)}
					</Grid>
					<Grid item lg={6} xs={6} xl={8}>
						<Typography className={classes.fieldTitle}>Name</Typography>
						{!isEditMode && <Typography className={classes.fieldValue}>{`${data.name}`}</Typography>}
						{isEditMode && (
							<FormControl fullWidth>
								<Controller
									render={({ field }) => <TextField {...field} disabled={isSaving} />}
									name="name"
									control={control}
									defaultValue={data.name}
								/>
							</FormControl>
						)}
					</Grid>
					{showControls && (
						<Grid item sm={3} xs={6} lg={3} xl={2}>
							<ButtonGroup>
								{!isEditMode && (
									<IconButton color="primary" onClick={() => setIsEditMode(true)} size="large">
										<EditIcon />
									</IconButton>
								)}

								{isEditMode && (
									<IconButton
										color="primary"
										onClick={() => setIsEditMode(true)}
										type="submit"
										style={{ marginRight: 15 }}
										size="large"
									>
										<DoneIcon />
									</IconButton>
								)}
								{isEditMode && (
									<IconButton color="secondary" onClick={() => setIsEditMode(false)} size="large">
										<ClearIcon />
									</IconButton>
								)}
							</ButtonGroup>
						</Grid>
					)}
				</Grid>

				<Divider variant="middle" className={classes.middleSpacer} />

				<Grid container spacing={3}>
					<Grid item lg={6} xl={3} xs={12}>
						<Typography className={classes.fieldTitle}>Address</Typography>
						{!isEditMode && <Typography className={classes.fieldValue}>{data.address}</Typography>}
						{isEditMode && (
							<FormControl fullWidth>
								<Controller
									render={({ field }) => <TextField {...field} disabled={isSaving} />}
									name="address"
									control={control}
									defaultValue={data.address || ''}
								/>
							</FormControl>
						)}
					</Grid>

					<Grid item lg={6} xl={3} xs={12}>
						<Typography className={classes.fieldTitle} style={{ marginBottom: 25 }}>
							Brand
						</Typography>
						{!isEditMode && <Typography className={classes.fieldValue}>{data.brand && data.brand.name}</Typography>}
						{isEditMode && (
							<AutocompleteAsync
								type="brand"
								label="Brand"
								filter={{}}
								shrink={false}
								showLabel={false}
								defaultValue={Number(brandId)}
								onChange={changeBrand}
							/>
						)}
					</Grid>

					<Divider variant="middle" className={classes.middleSpacer} />

					<Grid item lg={12} xl={8} xs={12}>
						<Typography className={classes.fieldTitle}>About</Typography>
						{!isEditMode && <Typography className={classes.fieldValue}>{data.description}</Typography>}
						{isEditMode && (
							<FormControl fullWidth>
								<Controller
									render={({ field }) => <TextField {...field} disabled={isSaving} multiline />}
									name="description"
									control={control}
									defaultValue={data.description || ''}
								/>
							</FormControl>
						)}
					</Grid>

					<Divider variant="middle" className={classes.middleSpacer} />

					<Grid item sm={12} xs={12}>
						<Typography className={classes.fieldTitle}>Members</Typography>

						<Grid container spacing={3}>
							{renderMember(
								{
									dateApproved: undefined,
									updatedAt: undefined,
									createdAt: new Date(),
									createdById: 0,
									id: 0,
									member: data.createdBy,
									status: ApprovalStatus.APPROVED,
									userId: data.createdById,
								},
								0
							)}
							{data.members.filter((m) => m.member && m.member.id !== data.createdById).map(renderMember)}
						</Grid>
					</Grid>
				</Grid>
			</form>
			<Dialog onClose={() => setImageEditVisible(false)} aria-labelledby="simple-dialog-title" open={imageEditVisible}>
				<ImageEditor aspectRatio={1} image={uploadImage} onCancel={() => setImageEditVisible(false)} onSave={handleImageSave} />
			</Dialog>
		</>
	);
}

export default memo(CommunityGroupInfoComponent);
