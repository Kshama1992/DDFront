/**
 * TODO
 */
// eslint-disable-next-line import/prefer-default-export
export const siteDescriptionHelper = (description?: string) => {
	const baseDescription = 'Coworking Space, Meeting Rooms, and Private Workspace All On Demand';
	if (description) return `${description} - ${baseDescription}`;
	return baseDescription;
};
