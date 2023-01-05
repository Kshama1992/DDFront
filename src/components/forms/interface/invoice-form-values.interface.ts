import InvoiceInterface from 'dd-common-blocks/dist/interface/invoice.interface';

export default // @ts-ignore
interface InvoiceFormValuesInterface extends InvoiceInterface {
	refundNote?: string | number;
}
