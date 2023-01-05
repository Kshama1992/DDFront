import dayjs from 'dayjs';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import SubscriptionInterface from 'dd-common-blocks/dist/interface/subscription.interface';

export default function isSubscriptionsExpired(user: UserInterface): boolean {
	if (!user.subscriptions || user.subscriptions.length === 0) return true;

	return (
		user.subscriptions.filter((s: SubscriptionInterface) => {
			// @ts-ignore
			const endDate = dayjs(s.endDate);
			return endDate.isAfter(dayjs()) && s.isOngoing;
		}).length === 0
	);
}
