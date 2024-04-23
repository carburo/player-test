import {Composition} from 'remotion';
import {MyComposition} from './Composition';
import {aymara, industrialRevolution} from './video';
import {video as napoleon} from './napoleon';
import {VideoSchema, videoSchema} from './schema';
import {transform} from './schemaTransform';

const FPS = 30;

export function RemotionRoot() {
	return (
		<>
			<CompositionItem
				id="IndustrialRevolution"
				video={industrialRevolution}
			/>
			<CompositionItem id="Aymara" video={aymara} />
			<CompositionItem id="Napoleon" video={napoleon} />
		</>
	);
}

function CompositionItem({video, id}: {video: VideoSchema; id: string}) {
	const transformedVideo = transform(video, FPS);
	return (
		<Composition
			id={id}
			component={MyComposition}
			durationInFrames={transformedVideo.durationInFrames}
			fps={FPS}
			width={video.width}
			height={video.height}
			schema={videoSchema}
			defaultProps={video}
		/>
	);
}
