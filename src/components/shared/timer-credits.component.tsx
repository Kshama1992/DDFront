import React, { useEffect, useState } from 'react';
import dayjs, { Dayjs, extend } from 'dayjs';
import dayjsduration from 'dayjs/plugin/duration';
import { _calcItemHours } from 'dd-common-blocks/dist/invoice';
import SpaceInterface from 'dd-common-blocks/dist/interface/space.interface';
import { SecondsToTimeHelper } from 'dd-common-blocks';

extend(dayjsduration);

function TimerCreditsComponent({ date, space }: { date: Dayjs; space: SpaceInterface }) {
	const initialTime = _calcItemHours({ startDate: date.toString(), endDate: dayjs().toString(), space });
	const [duration, setDuration] = useState<string>(SecondsToTimeHelper(initialTime * 60 * 60) as string);
	useEffect(() => {
		const timerInterval = setInterval(() => {
			const creditTime = _calcItemHours({ startDate: date.toString(), endDate: dayjs().toString(), space });
			setDuration(SecondsToTimeHelper(creditTime * 60 * 60) as string);
		}, 1000);
		return () => {
			clearInterval(timerInterval);
		};
	}, []);

	return <>{duration}</>;
}

export default TimerCreditsComponent;
