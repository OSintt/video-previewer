import path from "path";
import { tmpdir } from "os";
const CLIP_COUNT = 5;
const CLIP_TIME = 5;
const SPEED_MULTI = 2;
const CLIP_SELECT_STRATEGY = "max-size"; // max-size min-size random
const CLIP_RANGE = [0.1, 0.9];
const FPS_RATE = -1;

export const TEMP_PATH = path.join(tmpdir(), "video-previewer");
export const OUTPUT_PATH = "output.webp";
export const defaultOptions: FFmpegOptions = {
  clipCount: CLIP_COUNT,
  clipTime: CLIP_TIME,
  clipSelectStrategy: CLIP_SELECT_STRATEGY,
  clipRange: CLIP_RANGE,
  fpsRate: FPS_RATE,
  output: { type: "buffer", path: "/" },
  speedMulti: SPEED_MULTI,
};

export const defaultCaptions: Caption[] = [
  { start: "00:00:01", end: "00:00:02" },
];
