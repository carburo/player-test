export interface VideoSchema {
  width: number;
  height: number;
  clips: Clip[];
}

export interface Clip {
  durationInFrames: number;
}