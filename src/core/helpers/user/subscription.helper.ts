import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import SubscriptionInterface from 'dd-common-blocks/dist/interface/subscription.interface';

/**
 * Check if use has 24/7 access in his subscriptions for same brand
 * @param {UserInterface} user User object with subscriptions relation
 * @param {number} objectBrandId Objects brand ID to compare
 * @returns {boolean} Boolean
 */
export function isAccess247(user: UserInterface, objectBrandId: number): boolean {
	if (!user || !user.subscriptions || user.subscriptions.length === 0) return false;
	return user.subscriptions.filter((s: SubscriptionInterface) => s.access247 && s.brandId === objectBrandId).length > 0;
}

/**
 * Get users first subscription with 24/7 access
 * @param {UserInterface | undefined } user User object with subscriptions relation
 * @returns {SubscriptionInterface | undefined}
 */
export function getSubscription247(user: UserInterface | undefined): SubscriptionInterface | undefined {
	if (!user || !user.subscriptions || user.subscriptions.length === 0) return undefined;
	return user.subscriptions.find((s: SubscriptionInterface) => s.access247);
}
