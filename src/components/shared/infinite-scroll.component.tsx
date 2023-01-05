import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { debounce, useDebounce } from '@helpers/debounce.helper';
import CustomScrollbar from './custom-scrollbar.component';

interface Props {
	limit?: number;
	itemFn: (items: any[]) => any;
	preLoaderFn?: any;
	loaderFn?: any;
	noDataFn?: any;
	errorFn?: (e: Error) => any;
	apiObj: AxiosRequestConfig;
	className?: string;
}
export default function InfiniteScrollComponent({ itemFn, apiObj, errorFn, noDataFn, loaderFn, limit = 6, className, preLoaderFn }: Props): any {
	const [data, setData] = useState<any[]>([]);
	const [firstLoad, setFirstLoad] = useState(true);
	const [hasMore, setHasMore] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | undefined>(undefined);
	const [offset, setOffset] = useState(0);
	const [params, setParams] = useState({ ...apiObj.params, limit, offset });

	const debouncedApiObj = useDebounce(apiObj, 700);
	const debouncedParams = useDebounce(params, 700);

	const loadData = useCallback(async () => {
		setIsLoading(true);

		try {
			const {
				data: { items, count },
			} = await axios.request({ ...apiObj, params: { ...params, ...apiObj.params, offset, limit } });

			const newData = [...data, ...items];
			setHasMore(newData.length !== count);
			setData(newData);
		} catch (e) {
			setError(e);
		} finally {
			setIsLoading(false);
			setFirstLoad(false);
		}
	}, [offset, debouncedParams]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	useEffect(() => {
		setData([]);
		setOffset(0);
		const newParams = { ...params, ...apiObj.params };
		if (JSON.stringify(params) !== JSON.stringify(newParams)) setParams(newParams);
	}, [debouncedApiObj]);

	const onscroll = debounce(async (e) => {
		if (!hasMore) return;
		if (e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight) {
			const nextOffset = offset + limit;
			setOffset(nextOffset);
		}
	}, 200);

	return (
		<CustomScrollbar autoHide className={className} onScroll={onscroll}>
			<>
				{firstLoad && preLoaderFn}
				{error && errorFn && errorFn(error)}
				{!error && !isLoading && (!data || !data.length) && noDataFn}
				{data && itemFn(data)}
				{isLoading && loaderFn}
			</>
		</CustomScrollbar>
	);
}
