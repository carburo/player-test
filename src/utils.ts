export function secsToFrames(seconds: number, fps: number) {
  return Math.round(seconds * fps)
}