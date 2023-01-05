import type BrandInterface from 'dd-common-blocks/dist/interface/brand.interface';

export default interface FeedCategoryFormValuesInterface {
	id?: string | number | undefined;
	name: string;
	brandId: number;
	brand?: BrandInterface;
}
