export default function decodeHTMLContent(htmlText: any) {
	const txt = document.createElement('span');
	txt.innerHTML = htmlText;
	return txt.innerText;
}
