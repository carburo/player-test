import {Composition} from 'remotion';
import {MyComposition} from './Composition';
import {video} from './video';
import {video as napoleon} from './napoleon';
import {videoSchema} from './schema';
import {transform} from './schemaTransform';

const FPS = 30;

export function RemotionRoot() {
	const transformedVideo = transform(video, FPS);
	return (
		<>
			<Composition
				id="Aymara"
				component={MyComposition}
				durationInFrames={transformedVideo.durationInFrames}
				fps={FPS}
				width={video.width}
				height={video.height}
				schema={videoSchema}
				defaultProps={video}
			/>
			<Composition
				id="Napoleon"
				component={MyComposition}
				durationInFrames={transformedVideo.durationInFrames}
				fps={FPS}
				width={napoleon.width}
				height={napoleon.height}
				schema={videoSchema}
				defaultProps={napoleon}
			/>
		</>
	);
}
