import {
	AbsoluteFill,
	Audio,
	Sequence,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {VideoSchema} from './schema';
import {transform} from './schemaTransform';

const colors = [
	'teal',
	'peru',
	'skyblue',
	'orange',
	'thistle',
	'aquamarine',
	'gainsboro',
];

export const MyComposition = (props: VideoSchema) => {
	return (
		<AbsoluteFill
			style={{
				fontFamily: 'system-ui',
				justifyContent: 'center',
				alignItems: 'center',
				fontSize: 100,
				backgroundColor: 'white',
			}}
		>
			{props.audioTracks?.map((audio) => {
				const path = audio.path
					?.replace('https://res.cloudinary.com/', '/')
					.replace('https://vod.front10.cloud/', '/');
				return path ? (
					<Audio
						src={staticFile(path)}
						loop={audio.loop ?? true}
						volume={audio.mixVolume}
					/>
				) : null;
			})}
			<Clips {...props} />
		</AbsoluteFill>
	);
};

function Clips(props: VideoSchema) {
	const {fps} = useVideoConfig();
	const {durations, frames} = transform(props, fps);

	return props.clips.map((clip, i) => {
		return <Clip {...clip} frame={frames[i]!} duration={durations[i]!} />;
	});
}

function Clip(clip: VideoSchema['clips'][number] & {frame: number}) {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const durationInFrames = Math.round(clip.duration * fps);

	return (
		<Sequence from={clip.frame} durationInFrames={durationInFrames}>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: colors[clip.frame % colors.length],
				}}
			>
				{clip.layers.map((layer) => {
					if (layer.type === 'woxo-custom-text-basic') {
						const startFrame =
							clip.frame + Math.round((layer.start || 0) * fps);
						const endFrame = clip.frame + Math.round((layer.stop || 0) * fps);
						if (frame >= startFrame && frame < endFrame) {
							return <Text text={layer.text} />;
						}
					}
					return null;
				})}
			</AbsoluteFill>
		</Sequence>
	);
}

function Text({text}: {text?: string}) {
	// const frame = useCurrentFrame();
	// const {fps} = useVideoConfig();
	// const opacity = interpolate(frame, [0, 60], [0, 1], {
	// 	extrapolateRight: 'clamp',
	// });
	// const scale = spring({
	// 	fps,
	// 	frame,
	// });
	// return <div style={{opacity, transform: `scale(${scale})`}}>{text}</div>;
	return text;
}
