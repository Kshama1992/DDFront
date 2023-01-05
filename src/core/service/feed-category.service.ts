import FeedCategoryInterface from 'dd-common-blocks/dist/interface/feed-category.interface';
import BaseListFilterInterface from 'dd-common-blocks/dist/interface/filter/base-list-filter.interface';
import FeedCategoryFormValuesInterface from '@forms/interface/feed-category-form-values.interface';
import BaseService from './base.service';

interface FeedCategorySearchInterface extends BaseListFilterInterface {
	name?: string;
	brandId?: number;
	categoryId?: number;
}

export default class FeedCategoryService extends BaseService {
	baseEndpoint = 'feed-category';

	list(params: FeedCategorySearchInterface): Promise<[FeedCategoryInterface[], number]> {
		return super.list<FeedCategoryInterface, FeedCategorySearchInterface>(params);
	}

	save(data: FeedCategoryFormValuesInterface, id?: string | number | null | undefined) {
		return super.save<FeedCategoryFormValuesInterface>(data, id);
	}

	single(id: string | number | undefined) {
		return super.single<FeedCategoryInterface>(id);
	}

	delete(id: string | number | undefined) {
		return super.delete<FeedCategoryInterface>(id);
	}
}
