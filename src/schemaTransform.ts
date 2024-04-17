import {VideoSchema} from './schema';

const FPS = 30;

export function transform(video: VideoSchema, fps = FPS) {
	const durations = video.clips.map((clip) => clip.duration);
	const transitions = video.clips.map((clip) => clip.transition?.duration || 0);
	const times: number[] = [0];
	for (let i = 1; i < video.clips.length; i++) {
		times.push(times[i - 1]! + durations[i - 1]! - transitions[i - 1]!);
	}
	const frames = times.map((time) => Math.round(time * fps));

	return {
		durations,
		transitions,
		times,
		frames,
	};
}
