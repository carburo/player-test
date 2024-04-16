import {Composition} from 'remotion';
import {MyComposition} from './Composition';
import { video } from "./napoleon";
import { videoSchema } from './schema';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="MyComp"
				component={MyComposition}
				durationInFrames={60}
				fps={30}
				width={video.width}
				height={video.height}
				schema={videoSchema}
				defaultProps={video}
			/>
		</>
	);
};
