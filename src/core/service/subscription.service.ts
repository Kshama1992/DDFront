import SubscriptionInterface from 'dd-common-blocks/dist/interface/subscription.interface';
import SubFormValues from '@forms/interface/sub-form.interface';
import BaseService from './base.service';

export default class SubscriptionService extends BaseService {
	baseEndpoint = 'subscription';

	save(data: SubFormValues, id?: string | number | null | undefined) {
		return super.save(data, id);
	}

	single(id: string | number | undefined) {
		return super.single<SubscriptionInterface>(id);
	}

	delete(id: string | number | undefined) {
		return super.delete<SubscriptionInterface>(id);
	}

	resetBillCycle(id?: string | number) {
		return super.save({ resetBillAnchorToNow: true }, id);
	}
}
