export default function generateSlug(text: string) {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w- ]+/g, '')
		.replace(/ /g, '-')
		.replace(/\s/g, '-')
		.replace(/[-]+/g, '-');
}
