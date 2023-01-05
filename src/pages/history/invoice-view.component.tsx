import React, { memo, useEffect, useState, useCallback } from 'react';
import InvoiceInterface from 'dd-common-blocks/dist/interface/invoice.interface';
import UserInterface from 'dd-common-blocks/dist/interface/user.interface';
import FormInvoiceComponent from '@forms/form-invoice.component';
import InvoiceService from '@service/invoice.service';
import CircularProgress from '@mui/material/CircularProgress';

function InvoiceViewComponent({
	invoiceId,
	onClose,
	user,
	doBgRefresh,
}: {
	invoiceId?: number;
	onClose: () => any;
	user: UserInterface;
	doBgRefresh?: () => void;
}) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [invoice, setInvoice] = useState<InvoiceInterface>();

	const invoiceService = new InvoiceService();

	const loadInvoice = useCallback(async () => {
		if (!invoiceId) return;
		setIsLoading(true);
		const i = await invoiceService.single(invoiceId);
		setInvoice(i);
		setIsLoading(false);
	}, [invoiceId]);

	useEffect(() => {
		loadInvoice().then();
	}, [invoiceId]);

	const handleClose = () => onClose();

	const doRefresh = async () => {
		if (doBgRefresh) doBgRefresh();
		await loadInvoice();
	};

	if (isLoading) return <CircularProgress />;
	return <FormInvoiceComponent user={user} handleClose={handleClose} initialValues={invoice} doRefresh={doRefresh} />;
}

export default memo(InvoiceViewComponent);
