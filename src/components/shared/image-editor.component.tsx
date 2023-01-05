import React, { useRef, useState } from 'react';
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable import/no-named-as-default */
import Cropper from 'react-cropper';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cropperjs/dist/cropper.css';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import BorderVerticalIcon from '@mui/icons-material/BorderVertical';
import BorderHorizontalIcon from '@mui/icons-material/BorderHorizontal';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import Card from '@mui/material/Card';
import { CardActionArea } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function ImageEditor({
	image,
	aspectRatio,
	onCancel,
	onSave,
}: {
	image: string;
	aspectRatio?: number;
	onCancel?: () => void;
	onSave: (base64: string) => void;
}) {
	// @ts-ignore
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'), { noSsr: false });

	const [outputImage, setOutputImage] = useState<string>(image);
	const [flippedVertical, setFlippedVertical] = useState<boolean>(false);
	const [flippedHorizontal, setFlippedHorizontal] = useState<boolean>(false);
	const cropperRef = useRef<any>(null);

	const onCrop = () => {
		setOutputImage(cropperRef && cropperRef.current ? cropperRef.current.cropper.getCroppedCanvas().toDataURL() : '');
	};

	const rotateImage = (isClockwise = true) => {
		if (cropperRef) cropperRef.current.cropper.rotate(isClockwise ? 90 : -90);
	};

	const flipImage = (vertical = true) => {
		if (vertical) {
			if (cropperRef) cropperRef.current.cropper.scale(flippedVertical ? 1 : -1, flippedHorizontal ? -1 : 1);
			setFlippedVertical(!flippedVertical);
		} else {
			if (cropperRef) cropperRef.current.cropper.scale(flippedVertical ? -1 : 1, flippedHorizontal ? 1 : -1);
			setFlippedHorizontal(!flippedHorizontal);
		}
	};

	const resetImage = () => {
		if (cropperRef) cropperRef.current.cropper.reset();
	};

	return (
		<Card>
			<CardActionArea>
				<CardContent>
					<Cropper
						ref={cropperRef}
						src={image || ''}
						responsive
						style={{ height: 400, width: '100%' }}
						aspectRatio={aspectRatio}
						initialAspectRatio={aspectRatio || 1}
						guides
						crop={onCrop}
					/>
				</CardContent>
			</CardActionArea>
			<CardActions>
				<IconButton aria-label="rotate left" onClick={() => rotateImage(false)} size="large">
					<RotateLeftIcon />
				</IconButton>

				<IconButton aria-label="rotate right" onClick={() => rotateImage(true)} size="large">
					<RotateRightIcon />
				</IconButton>

				<IconButton aria-label="flip vertical" onClick={() => flipImage(true)} size="large">
					<BorderVerticalIcon />
				</IconButton>

				<IconButton aria-label="flip horizontal" onClick={() => flipImage(false)} size="large">
					<BorderHorizontalIcon />
				</IconButton>

				<IconButton aria-label="flip horizontal" onClick={() => resetImage()} size="large">
					<LayersClearIcon />
				</IconButton>

				{!isMobile && (
					<>
						<Button style={{ marginLeft: 'auto' }} onClick={() => onSave(outputImage)}>
							Save
						</Button>
						<Button onClick={() => (onCancel ? onCancel() : null)}>Cancel</Button>
					</>
				)}
			</CardActions>

			{isMobile && (
				<>
					<CardActions>
						<Button style={{ marginLeft: 'auto' }} onClick={() => onSave(outputImage)}>
							Save
						</Button>
						<Button onClick={() => (onCancel ? onCancel() : null)}>Cancel</Button>
					</CardActions>
				</>
			)}
		</Card>
	);
}
