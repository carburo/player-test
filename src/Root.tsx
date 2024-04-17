import {Composition} from 'remotion';
import {MyComposition} from './Composition';
import {video} from './napoleon';
import {videoSchema} from './schema';
import { transform } from './schemaTransform';

const FPS = 30;

export function RemotionRoot() {
	const transformedVideo = transform(video, FPS);
	return (
		<>
			<Composition
				id="MyComp"
				component={MyComposition}
				durationInFrames={transformedVideo.durationInFrames}
				fps={FPS}
				width={video.width}
				height={video.height}
				schema={videoSchema}
				defaultProps={video}
			/>
		</>
	);
}
