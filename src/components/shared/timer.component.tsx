import React, { useEffect, useState } from 'react';
import dayjs, { Dayjs, extend } from 'dayjs';
import dayjsduration from 'dayjs/plugin/duration';
import { SecondsToTimeHelper } from 'dd-common-blocks';

extend(dayjsduration);

function TimerComponent({ date }: { date: Dayjs }) {
	const [duration, setDuration] = useState<string>('');
	useEffect(() => {
		const timerInterval = setInterval(() => {
			setDuration(SecondsToTimeHelper(dayjs().diff(dayjs(date), 's'), true, true) as string);
		}, 1000);
		return () => {
			clearInterval(timerInterval);
		};
	}, []);

	return <>{duration}</>;
}

export default TimerComponent;
