import trimText from '@helpers/trim-text.helper';
import React, { useState } from 'react';

interface ReadMoreProps {
	text: string;
	min?: number;
	ideal?: number;
	max?: number;
	readMoreText: string;
}
export default function ReadMoreComponent({ text, min, max, ideal, readMoreText = 'read more' }: ReadMoreProps) {
	const [primaryText, secondaryText] = trimText(text, min, ideal, max);

	const [displaySecondary, setDisplaySecondary] = useState<boolean>(false);

	const toggleDisplay = () => {
		setDisplaySecondary(!displaySecondary);
	};

	let displayText;
	if (!secondaryText) {
		displayText = (
			<div className="display-text-group">
				<span className="displayed-text">{`${primaryText} ${secondaryText}`}</span>
			</div>
		);
	} else if (displaySecondary) {
		displayText = (
			<div className="display-text-group">
				<span className="displayed-text" onClick={toggleDisplay}>
					{`${primaryText} ${secondaryText}`}
				</span>
			</div>
		);
	} else {
		displayText = (
			<div className="display-text-group">
				<span className="displayed-text">
					{primaryText}
					<span style={{ display: 'none' }}>{secondaryText}</span>
					<div className="read-more-button" onClick={toggleDisplay}>
						{readMoreText}
					</div>
				</span>
			</div>
		);
	}

	return displayText;
}
