import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

export const MyComposition = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const opacity = interpolate(frame, [0, 60], [0, 1], {
		extrapolateRight: 'clamp',
	});
	const scale = spring({
    fps,
    frame,
  });

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
			<div style={{opacity, transform: `scale(${scale})`}}>Hello World</div>
		</AbsoluteFill>
	);
};
