import React, { forwardRef } from 'react';

interface AnchorLinkComponentProps {
	href: string;
	offset?: string | undefined;
	onClick?: (e: any) => any;
}

const AnchorLinkComponent = forwardRef<HTMLAnchorElement, AnchorLinkComponentProps>(
	({ href, offset, onClick, ...rest }: AnchorLinkComponentProps, ref) => {
		const smoothScroll = (event: any) => {
			event.preventDefault();
			const e = { ...event };

			if (history.pushState && href) {
				history.pushState({}, '', href);
				window.dispatchEvent(new Event('hashchange'));
			}
			setTimeout(() => {
				let thisOffset = () => 0;
				if (typeof offset !== 'undefined') {
					thisOffset = () => parseInt(offset);
				}
				const id = e.currentTarget.getAttribute('href').slice(1);
				const $anchor = document.getElementById(id);
				// Check if the change occurs for the x or y axis
				if ($anchor && $anchor.getBoundingClientRect().top !== 0) {
					window.scroll({
						top: $anchor.getBoundingClientRect().top + window.pageYOffset - thisOffset(),
						behavior: 'smooth',
					});
				} else if ($anchor && $anchor.getBoundingClientRect().left !== 0) {
					window.scroll({
						left: $anchor.getBoundingClientRect().left + window.pageXOffset - thisOffset(),
						behavior: 'smooth',
					});
				}
				if (onClick) {
					onClick(e);
				}
			}, 0);
		};

		return <a ref={ref} href={href} {...rest} onClick={smoothScroll} />;
	}
);

export default AnchorLinkComponent;
