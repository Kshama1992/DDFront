import { Dayjs } from 'dayjs';

export default interface AccessHFormValues {
	id?: string | number | undefined;
	weekday: string;
	open: boolean;
	userId?: number;
	subscriptionId?: number;
	accessHoursFrom: string | Dayjs | Date | undefined;
	accessHoursTo: string | Dayjs | Date | undefined;
}
