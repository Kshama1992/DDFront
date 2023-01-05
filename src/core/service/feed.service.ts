import BaseListFilterInterface from 'dd-common-blocks/dist/interface/filter/base-list-filter.interface';
import FeedInterface from 'dd-common-blocks/dist/interface/feed.interface';
import FeedCommentInterface from 'dd-common-blocks/dist/interface/feed-comment.interface';
import BaseService from './base.service';

interface FeedSearchInterface extends BaseListFilterInterface {
	name?: string;
	brandId?: number;
	categoryId?: number;
}

export default class FeedService extends BaseService {
	baseEndpoint = 'feed';

	async comment(feedId: number | undefined, data: Partial<FeedCommentInterface>): Promise<any> {
		if (typeof feedId === 'undefined') throw new Error('no feed id');
		return super.request<FeedInterface>({ url: `${this.baseEndpoint}/${feedId}/comment`, method: 'post', data });
	}

	async like(feedId: string | number | undefined, userId: string | number | undefined): Promise<any> {
		if (typeof feedId === 'undefined') throw new Error('no feed id');
		if (typeof userId === 'undefined') throw new Error('no user id');
		return super.request<FeedInterface>({ url: `${this.baseEndpoint}/${feedId}/like`, method: 'post', data: { userId } });
	}

	async pin(feedId: string | number | undefined, userId: string | number | undefined): Promise<FeedInterface> {
		if (typeof feedId === 'undefined') throw new Error('no feed id');
		if (typeof userId === 'undefined') throw new Error('no user id');
		return super.request<FeedInterface>({ url: `${this.baseEndpoint}/${feedId}/pin`, method: 'post', data: { userId } });
	}

	async report(feedId: string | number | undefined, userId: string | number | undefined): Promise<FeedInterface> {
		if (typeof feedId === 'undefined') throw new Error('no feed id');
		if (typeof userId === 'undefined') throw new Error('no user id');
		return super.request<FeedInterface>({ url: `${this.baseEndpoint}/${feedId}/report`, method: 'post', data: { userId } });
	}

	list(params: FeedSearchInterface): Promise<[FeedInterface[], number]> {
		return super.list<FeedInterface, FeedSearchInterface>(params);
	}

	save(data: FeedInterface, id?: string | number | null | undefined) {
		return super.save<FeedInterface>(data, id);
	}

	single(id: string | number | undefined) {
		return super.single<FeedInterface>(id);
	}

	delete(id: string | number | undefined) {
		return super.delete<FeedInterface>(id);
	}
}
