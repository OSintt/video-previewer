interface FFmpegOptions {
  clipCount?: number;
  clipTime?: number;
  clipSelectStrategy?: string;
  clipRange?: number[];
  fpsRate?: number;
  output?: OutputOptions;
  speedMulti?: number;
  width?: number;
  height?: number;
  bitrate?: number;
  videoCodec?: string;
  audioCodec?: string;
  audioBitrate?: number;
  format?: string;
  useHardwareAcceleration?: boolean;
  additionalOptions?: string;
}
interface OutputOptions {
  type: "dir" | "file" | "buffer";
  path: string;
}

interface Caption {
  start: string;
  end: string;
}
