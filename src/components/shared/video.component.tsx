import React from 'react';
import ReactPlayer from 'react-player';

const youtubeReg =
	/(?:http(?:s)?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^?&"'<> #]+)/g;
const vimeoReg = /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|)(\d+)(?:|\/\?)/g;

export function isVideoUrl(url: string) {
	return url.match(vimeoReg) !== null || url.match(youtubeReg) !== null;
}

export default function VideoComponent({ videoUrl }: { videoUrl: string }) {
	return (
		<div style={{ width: '100%', height: '100%', maxWidth: 640 }}>
			<ReactPlayer
				url={videoUrl}
				playing
				pip
				controls={false}
				config={{
					youtube: {
						playerVars: { showinfo: 0, modestbranding: 0 },
					},
				}}
			/>
		</div>
	);
}
