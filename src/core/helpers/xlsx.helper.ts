// eslint-disable-next-line import/prefer-default-export
export function addCellToSheet(worksheet: any, address: any, value: any, xlsx: any, format: string | number | undefined = undefined) {
	/* cell object */
	const cell: any = { t: '?', v: value };
	if (format) cell.s = { numFmt: format };

	/* assign type */
	if (typeof value === 'string') cell.t = 's';
	// string
	else if (typeof value === 'number') cell.t = 'n';
	// number
	else if (value === true || value === false) cell.t = 'b';
	// boolean
	else if (value instanceof Date) cell.t = 'd';
	else throw new Error('cannot store value');

	/* add to worksheet, overwriting a cell if it exists */
	// eslint-disable-next-line no-param-reassign
	worksheet[address] = cell;

	/* find the cell range */
	const range = xlsx.utils.decode_range(worksheet['!ref']);
	const addr = xlsx.utils.decode_cell(address);

	/* extend the range to include the new cell */
	if (range.s.c > addr.c) range.s.c = addr.c;
	if (range.s.r > addr.r) range.s.r = addr.r;
	if (range.e.c < addr.c) range.e.c = addr.c;
	if (range.e.r < addr.r) range.e.r = addr.r;

	/* update range */
	// eslint-disable-next-line no-param-reassign
	worksheet['!ref'] = xlsx.utils.encode_range(range);
}

export function formatColumn(worksheet: any, col: number, fmt: any, xlsx: any) {
	const range = xlsx.utils.decode_range(worksheet['!ref']);
	// note: range.s.r + 1 skips the header row
	for (let row = range.s.r + 1; row <= range.e.r; row += 1) {
		const ref = xlsx.utils.encode_cell({ r: row, c: col });
		if (worksheet[ref] && worksheet[ref].t === 'n') {
			// eslint-disable-next-line no-param-reassign
			worksheet[ref].z = fmt;
		}
	}
}
