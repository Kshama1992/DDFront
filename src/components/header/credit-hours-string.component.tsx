import React, { useContext } from 'react';
import HoursType from 'dd-common-blocks/dist/type/HoursType';
import SubscriptionInterface from 'dd-common-blocks/dist/interface/subscription.interface';
import SubscriptionCreditHoursInterface from 'dd-common-blocks/dist/interface/subscription-credit-hours.interface';
import SubscriptionCreditsRotationInterface from 'dd-common-blocks/dist/interface/subscription-credit-rotation.interface';
import { AuthContext } from '@context/auth.context';
import { SecondsToTimeHelper } from 'dd-common-blocks';

export default function CreditHoursStringComponent({
	subscription,
	hoursType,
	isMobile = false,
}: {
	subscription: SubscriptionInterface | undefined;
	hoursType: HoursType | undefined;
	isMobile?: boolean;
}) {
	const { authBody } = useContext(AuthContext);

	if (subscription && hoursType) {
		const hours = subscription.creditHours?.find((h: Partial<SubscriptionCreditHoursInterface>) => h.type === hoursType);
		if (typeof hours !== 'undefined') {
			const given = SecondsToTimeHelper(hours.given! * 60 * 60);

			const used = subscription
				.creditsRotation!.filter(
					(cr: Partial<SubscriptionCreditsRotationInterface>) =>
						cr.userId! === authBody!.id && cr.rotationType! === 'space' && cr.type === hoursType
				)
				.map((cr: Partial<SubscriptionCreditsRotationInterface>) => cr.amount!)
				.reduce((a: number | undefined, b: number | undefined) => Math.round(a || 0) + Math.round(b || 0), 0); // numbers stored in db are negative

			if (isMobile)
				return (
					<span>
						<>
							<b>Total:</b> {given} hrs.
							<b style={{ marginLeft: 15 }}>Used:</b> {used} hrs.
						</>
					</span>
				);
			return (
				<span>
					<>
						Total: {given} hrs. / Used: {used} hrs.
					</>
				</span>
			);
		}

		return <span>No credits available</span>;
	}
	return <span style={{ opacity: 0 }}>___</span>;
}
