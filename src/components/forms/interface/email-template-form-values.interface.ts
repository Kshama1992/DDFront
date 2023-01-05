import type BrandInterface from 'dd-common-blocks/dist/interface/brand.interface';
import EntityStatus from 'dd-common-blocks/dist/type/EntityStatus';
import EmailTemplateTypeInterface from 'dd-common-blocks/dist/interface/email-template-type.interface';

export default interface EmailTemplateFormValuesInterface {
	brandId?: number;
	name?: string;
	subject?: string;

	fromEmail?: string;

	fromName?: string;

	assignedBrands?: BrandInterface[];

	emailTemplateTypeId?: number;

	emailTemplateType?: EmailTemplateTypeInterface;

	status: EntityStatus;

	html?: string;
	unlayerDesign?: any;
}
