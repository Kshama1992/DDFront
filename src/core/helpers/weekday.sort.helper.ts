import AccessHFormValues from '@forms/interface/access-h-form-values.interface';

export default function WeekdaySorterHelper(a: AccessHFormValues, b: AccessHFormValues): number {
	const sortDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	return sortDays.indexOf(a.weekday || '') - sortDays.indexOf(b.weekday || '');
}
