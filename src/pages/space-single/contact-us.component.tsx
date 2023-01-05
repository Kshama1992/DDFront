import React from 'react';
import PackageShow from 'dd-common-blocks/dist/type/PackageShow';
import Typography from '@mui/material/Typography';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import PhoneIcon from '@mui/icons-material/Phone';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import { SUPPORT_EMAIL } from '../../core/config';
import ContactUsStyle from './style/contact-us.style';

interface ContactUsComponentProps {
	space: SpaceInterface;
}

export default function ContactUsComponent({ space }: ContactUsComponentProps) {
	const classes = ContactUsStyle();

	return (
		<>
			{space.packageShow === PackageShow.PUBLIC && (
				<>
					<a href="tel:+1 917-310-4662" className={classes.questionLink}>
						<Typography>
							<PhoneIcon className={classes.singleSpaceQuestionsIcon} />
							Call +1 917-310-4662
						</Typography>
					</a>

					<a href={`mailto:?subject=Issue%20with%20package%20${space.id}&to=${SUPPORT_EMAIL}`} className={classes.questionLink}>
						<Typography className={classes.singleSpaceQuestionsMail}>
							<ModeCommentIcon className={classes.singleSpaceQuestionsIcon} />
							Support Email
						</Typography>
					</a>
				</>
			)}

			{space.packageShow !== PackageShow.PUBLIC && (
				<>
					<a href={`tel: +${space.venue.phone}`} className={classes.questionLink}>
						<Typography>
							<PhoneIcon className={classes.singleSpaceQuestionsIcon} />
							Call +{space.venue.phone}
						</Typography>
					</a>

					<a href={`mailto:?subject=Issue%20with%20package%20${space.id}&to=${space.venue.email}`} className={classes.questionLink}>
						<Typography className={classes.singleSpaceQuestionsMail}>
							<ModeCommentIcon className={classes.singleSpaceQuestionsIcon} />
							Support Email
						</Typography>
					</a>
				</>
			)}
		</>
	);
}
