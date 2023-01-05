import { Dayjs } from 'dayjs';
import type VenueStatus from 'dd-common-blocks/dist/type/VenueStatus';
import type FileInterface from 'dd-common-blocks/dist/interface/file.interface';
import type AccessHFormValues from '@forms/interface/access-h-form-values.interface';
import type { GeolocationData } from '@helpers/geolocate.helper';

export default interface VenueFormValuesInterface {
	id?: string | number | undefined;
	name: string;
	alias: string;
	tzId: string;
	tzOffset: number;
	countryCode: string;
	accessHoursFrom: string | Dayjs | Date;
	accessHoursTo: string | Dayjs | Date;
	description: string;
	coordinates: {
		type: string;
		coordinates: number[];
	};
	city?: string;
	state?: string;
	country: string;
	currency: string;
	phone: number | string;
	showOnMap: boolean;
	accessOpen: boolean;
	addressObject?: GeolocationData; // temp object for address select
	address: string;
	address2?: string;
	accessCustom: boolean;
	status: VenueStatus;
	email?: string;
	brandId: number | string;
	createdById?: number | string;
	updatedById?: number | string;
	specialInstructions?: string;
	uploadAttachments?: string[];
	imageUrls?: string[];
	venueTypeId: number | string;
	accessCustomData: Array<AccessHFormValues>;
	photos?: Array<FileInterface>;
	logo?: FileInterface;
	uploadLogo?: string;
	uploadingPic?: string;
}
