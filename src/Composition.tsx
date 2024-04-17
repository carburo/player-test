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
				fontFamily: 'sans-serif',
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
						// eslint-disable-next-line @remotion/volume-callback
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
						<TransitionSeries.Sequence
							key={i}
							durationInFrames={durationInFrames}
						>
							{clip.layers.map((layer, index) => {
								switch (layer.type) {
									case 'woxo-custom-text-basic': {
										const startFrame =
											clipFrame + Math.round((layer.start || 0) * fps);
										const endFrame =
											clipFrame + Math.round((layer.stop || 0) * fps);
										if (frame >= startFrame && frame < endFrame) {
											return <Text key={index} {...layer} />;
										}
										break;
									}
									case 'woxo-image': {
										return (
											<AbsoluteFill key={index}>
												<Img
													src={staticFile(layer.path)}
													style={{
														objectFit:
															layer.resizeMode === 'contain-blur'
																? 'contain'
																: layer.resizeMode === 'stretch'
																? 'fill'
																: layer.resizeMode,
														height: '100%',
													}}
												/>
											</AbsoluteFill>
										);
									}
									default: {
										return null;
									}
								}
								return null;
							})}
						</TransitionSeries.Sequence>
						<TransitionSeries.Transition
							key={'t' + i}
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

	const stroke = layer.stroke || "#000";
	const strokeWidth = layer.strokeWidth || 0;
	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				fontWeight: '900',
				color: 'white',
				WebkitTextStrokeColor: stroke,
				WebkitTextStrokeWidth: strokeWidth / 2 
			}}
		>
			{layer.text}
		</AbsoluteFill>
	);
}
