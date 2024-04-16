import {Composition} from 'remotion';
import {MyComposition} from './Composition';
import {video} from './napoleon';
import {videoSchema} from './schema';

const FPS = 30;

export function RemotionRoot() {
	let duration = 0;
	for(const clip of video.clips) {
		duration += clip.duration;
	}

	return (
		<>
			<Composition
				id="MyComp"
				component={MyComposition}
				durationInFrames={Math.round(duration * FPS)}
				fps={FPS}
				width={video.width}
				height={video.height}
				schema={videoSchema}
				defaultProps={video}
			/>
		</>
	);
}
