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

export const MyComposition = (props: VideoSchema) => {
	const {fps} = useVideoConfig();
	const durations = props.clips.map(clip => clip.duration)
	const transitions = props.clips.map(clip => clip.transition?.duration || 0);
	const times: number[] = [0];
	for (let i = 1; i < props.clips.length; i++) {
		const prevTime = times[i - 1];
		times.push((prevTime || 0) + durations[i]! - transitions[i - 1]!);
	}
	const frames = times.map((time) => Math.round(time * fps));
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
			{props.clips.map((clip, i) => {
				return <Clip {...clip} frame={frames[i]!} duration={durations[i]!} />;
			})}
		</AbsoluteFill>
	);
};

function Clip(props: VideoSchema['clips'][number] & {frame: number}) {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const durationInFrames = Math.round(props.duration * fps);

	return (
		<Sequence from={props.frame} durationInFrames={durationInFrames}>
			{props.layers.map((layer) => {
				if (layer.type === 'woxo-custom-text-basic') {
					const startFrame = props.frame + Math.round((layer.start || 0) * fps);
					const endFrame = props.frame + Math.round((layer.stop || 0) * fps);
					if (frame >= startFrame && frame <= endFrame) {
						return (
							<AbsoluteFill
								style={{justifyContent: 'center', alignItems: 'center'}}
							>
								<Text text={layer.text} />
							</AbsoluteFill>
						);
					}
				}
				return null;
			})}
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
