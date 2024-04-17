import {
	AbsoluteFill,
	Audio,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	Img,
} from 'remotion';
import {VideoSchema} from './schema';
import {transform} from './schemaTransform';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import React from 'react';

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
				const {path} = audio;
				return path ? (
					<Audio
						key={path}
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
	const t = transform(props, fps);
	const frame = useCurrentFrame();

	return (
		<TransitionSeries>
			{props.clips.map((clip, i) => {
				const clipFrame = t.frames[i]!;
				const durationInFrames = Math.round(clip.duration * fps);
				const transitionInFrames = Math.round(
					(clip.transition?.duration || 0) * fps
				);
				return (
					<React.Fragment key={i}>
						<TransitionSeries.Sequence durationInFrames={durationInFrames}>
							<AbsoluteFill>
								<Img src={staticFile('/output/background/frame1.jpg')} />
							</AbsoluteFill>
							{clip.layers.map((layer, index) => {
								if (layer.type === 'woxo-custom-text-basic') {
									const startFrame =
										clipFrame + Math.round((layer.start || 0) * fps);
									const endFrame =
										clipFrame + Math.round((layer.stop || 0) * fps);
									if (frame >= startFrame && frame < endFrame) {
										return <Text key={index} {...layer} />;
									}
								}
								return null;
							})}
						</TransitionSeries.Sequence>
						<TransitionSeries.Transition
							presentation={fade()}
							timing={linearTiming({durationInFrames: transitionInFrames})}
						/>
					</React.Fragment>
				);
			})}
		</TransitionSeries>
	);
}

function Text(layer: VideoSchema['clips'][number]['layers'][number]) {
	if (layer.type !== 'woxo-custom-text-basic') {
		return null;
	}
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
	const {strokeWidth, stroke} = layer;
	const textShadow: string = `${strokeWidth}px ${strokeWidth}px 0 ${stroke}, 
	-${strokeWidth}px ${strokeWidth}px 0 ${stroke},
	-${strokeWidth}px -${strokeWidth}px 0 ${stroke},
	${strokeWidth}px -${strokeWidth}px 0 ${stroke}`;
	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				fontWeight: 'bold',
				color: 'white',
				textShadow,
			}}
		>
			{layer.text}
		</AbsoluteFill>
	);
}
