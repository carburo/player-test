import {
	AbsoluteFill,
	Audio,
	staticFile,
	useVideoConfig,
	Img,
	Sequence,
} from 'remotion';
import {VideoSchema} from './schema';
import {transform} from './schemaTransform';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import React from 'react';
import * as Montserrat from '@remotion/google-fonts/Montserrat';

const {fontFamily} = Montserrat.loadFont('normal', {
	weights: ['800'],
	subsets: ['latin', 'latin-ext'],
});

export const MyComposition = (props: VideoSchema) => {
	return (
		<AbsoluteFill
			style={{
				fontFamily,
				justifyContent: 'center',
				alignItems: 'center',
				fontSize: 100,
				fontWeight: 800,
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
								const startFrame =
									'start' in layer
										? Math.round((layer.start || 0) * fps)
										: clipFrame;
								const endFrame =
									'stop' in layer
										? Math.round((layer.stop || 0) * fps)
										: undefined;
								const sequenceDuration = endFrame
									? endFrame - startFrame <= 0
										? undefined
										: endFrame - startFrame
									: durationInFrames;
								return (
									<Sequence
										key={index}
										from={startFrame}
										durationInFrames={sequenceDuration}
									>
										<Layer {...layer} />
									</Sequence>
								);
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

function Layer(layer: VideoSchema['clips'][number]['layers'][number]) {
	switch (layer.type) {
		case 'woxo-custom-text-basic': {
			return <Text {...layer} />;
		}
		case 'woxo-image': {
			return (
				<AbsoluteFill>
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
}

function Text(layer: VideoSchema['clips'][number]['layers'][number]) {
	if (layer.type !== 'woxo-custom-text-basic') {
		return null;
	}

	const stroke = layer.stroke || '#000';
	const strokeWidth = layer.strokeWidth || 0;
	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				fontWeight: '900',
				color: 'white',
				letterSpacing: '0.04em',
				textShadow: `
					${strokeWidth}px ${strokeWidth}px 0 ${stroke}, 
					-${strokeWidth}px -${strokeWidth}px 0 ${stroke}, 
					-${strokeWidth}px ${strokeWidth}px 0 ${stroke}, 
					${strokeWidth}px -${strokeWidth}px 0 ${stroke}, 
					0 ${strokeWidth}px 0 ${stroke}, 
					0 -${strokeWidth}px 0 ${stroke}, 
					-${strokeWidth}px 0 0 ${stroke}, 
					${strokeWidth}px 0 0 ${stroke}`,
			}}
		>
			{layer.text}
		</AbsoluteFill>
	);
}
