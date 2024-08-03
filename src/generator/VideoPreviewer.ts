import { defaultCaptions, defaultOptions, TEMP_PATH } from "../config/Config";
import fs from "fs/promises";
import {
  writeVideo,
  extractClip,
  mergeClips,
  transToWebp,
  checkUseHardwareAcceleration,
} from "../utils/FileUtils";
import path from "path";

class VideoPreviewer {
  private tempDir: string;
  private optionsStr: string = "";
  constructor(
    private video: string,
    private outputDir: string,
    private captions: Caption[] = defaultCaptions,
    readonly options: FFmpegOptions = defaultOptions
  ) {
    this.tempDir = TEMP_PATH;
    this.outputDir = outputDir.endsWith(".webp")
      ? outputDir
      : outputDir + ".webp";
  }

  private async cleanUp() {
    try {
      await fs.rm(this.tempDir, { recursive: true, force: true });
    } catch (e) {
      throw new Error("Error removing temp directory");
    }
  }

  private async optionsToString(options: FFmpegOptions) {
    let optionStr = "";
    options.useHardwareAcceleration = await checkUseHardwareAcceleration();
    if (options.width && options.height) {
      optionStr += ` -s ${options.width}x${options.height}`;
    }
    if (options.fpsRate && options.fpsRate > 0) {
      optionStr += ` -r ${options.fpsRate}`;
    }
    if (options.speedMulti && options.speedMulti > 1) {
      optionStr += ` -filter:v "setpts=${1 / options.speedMulti}*PTS"`;
    }
    if (options.videoCodec) {
      optionStr += ` -c:v ${options.videoCodec}`;
    }
    if (options.audioCodec) {
      optionStr += ` -c:a ${options.audioCodec}`;
    }
    if (options.bitrate) {
      optionStr += ` -b:v ${options.bitrate}`;
    }
    if (options.audioBitrate) {
      optionStr += ` -b:a ${options.audioBitrate}`;
    }
    if (options.format) {
      optionStr += ` -f ${options.format}`;
    }
    if (options.useHardwareAcceleration) {
      optionStr += " -hwaccel cuda -c:v h264_cuvid";
    }
    if (options.additionalOptions) {
      optionStr += ` ${options.additionalOptions}`;
    }
    this.optionsStr = optionStr.trim();
  }

  public async exec() {
    try {
      await this.cleanUp();
      await this.optionsToString(this.options);
      await fs.mkdir(this.tempDir, { recursive: true });
      const videoOutputPath = path.join(this.tempDir, "output.mp4");
      const fileListPath = path.join(this.tempDir, "filelist.txt");
      const clipsPath = path.join(this.tempDir, "clips.mp4");
      const webpOutputPath = this.outputDir;
      await writeVideo(this.video, videoOutputPath, this.optionsStr);
      if (!this.captions) throw new Error("Frames are not specified");
      const snapshotPaths: string[] = [];
      for (let i = 0; i < this.captions.length; i++) {
        const { start, end } = this.captions[i];
        const snapshotPath = path.join(this.tempDir, `snapshot_${i + 1}.mp4`);
        await extractClip(
          videoOutputPath,
          snapshotPath,
          { start, end },
          this.optionsStr
        );
        snapshotPaths.push(snapshotPath);
      }
      await mergeClips(snapshotPaths, clipsPath, fileListPath, this.optionsStr);
      await transToWebp(clipsPath, webpOutputPath, this.optionsStr);
      return webpOutputPath;
    } catch (e) {
      throw new Error("Error executing command");
    } finally {
      await this.cleanUp();
    }
  }
}

export default VideoPreviewer;
