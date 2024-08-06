# video-previewer

Generate .webp video previews from .mp4 files using TypeScript and ffmpeg

### Installation

```bash
$ npm install video-previewer
$ pnpm add video-previewer
$ yarn add video-previewer
```

### Usage

```javascript
import VideoPreviewer from "./generator/VideoPreviewer";

const preview = new VideoPreviewer(
  "video.mp4",
  "output/path.webp", //output path
  [
    { start: "00:00:01", end: "00:00:04" }, // clips to take from video, string with 'HH:MM:SS' format
    { start: "00:04:01", end: "00:04:04" },
    { start: "00:12:01", end: "00:12:04" },
    { start: "00:13:01", end: "00:13:04" },
  ],
  {
    clipCount: 5,
    clipTime: 5,
    clipSelectStrategy: "max-size", // options: 'max-size', 'min-size', 'random'
    clipRange: [0.1, 0.9],
    fpsRate: 10, // number, -1 (default)
    output: {
      type: "buffer", // options: 'buffer' (default), 'file', 'dir'
      path: "", // Required if output type is not 'buffer' (specify file or directory path)
    },
    speedMulti: 2,
    width: 320, // number, video normal dimensions (default)
    height: -1, // number, video normal dimensions (default)
    bitrate: 1000, // optional, video bitrate in kbps
    videoCodec: "libx264", // optional, codec for video encoding
    audioCodec: "aac", // optional, codec for audio encoding
    audioBitrate: 128, // optional, audio bitrate in kbps
    format: "webp", // optional, output format for the preview
    useHardwareAcceleration: false, // optional, enable hardware acceleration for processing
    additionalOptions: "", // optional, any additional command line options for ffmpeg
  }
);
preview.exec();

```

**Available options:**

| **Option**                | **Type**        | **Default**                |
| ------------------------- | --------------- | -------------------------- |
| `clipCount`               | `number`        | -                          |
| `clipTime`                | `number`        | -                          |
| `clipSelectStrategy`      | `string`        | 'max-size'                 |
| `clipRange`               | `number[]`      | -                          |
| `fpsRate`                 | `number`        | -1 (default: original fps) |
| `output`                  | `OutputOptions` | `{type: 'buffer'}`         |
| `speedMulti`              | `number`        | -                          |
| `width`                   | `number`        | (default: original width)  |
| `height`                  | `number`        | (default: original heigth) |
| `bitrate`                 | `number`        | -                          |
| `videoCodec`              | `string`        | `'libx264'`                |
| `audioCodec`              | `string`        | `'aac'`                    |
| `audioBitrate`            | `number`        | `128`                      |
| `format`                  | `string`        | `'webp'`                   |
| `useHardwareAcceleration` | `boolean`       | `false`                    |
| `additionalOptions`       | `string`        | -                          |

---

### 🐼 @me

You can find me on twitter as 🐤 <a href="https://twitter.com/osinthappyemo">@osinthappyemo</a>
or on instagram as 🍢 <a href="https://instagram.com/osintxv">@osintxv</a>
