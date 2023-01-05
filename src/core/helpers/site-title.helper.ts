/**
 * TODO
 */
// eslint-disable-next-line import/prefer-default-export
export const siteTitleHelper = (title?: string) => {
	const baseTitle = 'Find Workspace & Meeting Rooms Near You';
	if (title) return `${title} - ${baseTitle}`;
	return baseTitle;
};
