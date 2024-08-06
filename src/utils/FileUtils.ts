import { exec } from "child_process";
import { promisify } from "util";
import { checkHasCuda, checkHasGPU, checkHasNpp } from "../utils/SystemUtils";
import axios from "axios";
import fs from "fs";

const execPromise = promisify(exec);

const runFFmpegCommand = async (command: string) => {
  try {
    const { stdout } = await execPromise(command);
    return stdout;
  } catch (error) {
    throw error;
  }
};

async function downloadVideo(
  url: string,
  filename: string
): Promise<string | null> {
  if (!filename.endsWith(".mp4")) filename += ".mp4";
  const directory = filename.substring(0, filename.lastIndexOf("/"));
  if (directory && !fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  const response = await axios.get(url, { responseType: "stream" });
  if (response.status === 200) {
    const writer = fs.createWriteStream(filename);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on("finish", () => resolve(filename));
      writer.on("error", reject);
    });
  } else {
    return null;
  }
}

export const writeVideo = async (input: string, output: string) => {
  return downloadVideo(input, output);
};

export const extractClip = async (
  input: string,
  output: string,
  time: { start: string; end: string },
  options: string = ""
) => {
  const command = `ffmpeg -i ${input} -ss ${time.start} -to ${time.end} ${options} ${output}`;
  return runFFmpegCommand(command);
};

export const mergeClips = async (
  inputs: string[],
  output: string,
  fileListPath: string,
  options: string
) => {
  let command: string;
  if (inputs.length === 1) {
    command = `ffmpeg -i ${inputs[0]} ${options} ${output}`;
  } else {
    const fileList = inputs.map((file) => `file '${file}'`).join("\n");
    fs.writeFileSync(fileListPath, fileList);
    command = `ffmpeg -f concat -safe 0 -i ${fileListPath} ${options} ${output}`;
  }
  await runFFmpegCommand(command);
};

export const transToWebp = async (
  input: string,
  output: string,
  options: string
) => {
  const command = `ffmpeg -i ${input} -c:v libwebp ${options} ${output}`;
  return runFFmpegCommand(command);
};

export const checkUseHardwareAcceleration = async (): Promise<boolean> => {
  const hasGpu = await checkHasGPU();
  const hasCuda = hasGpu && (await checkHasCuda());
  const hasNpp = hasCuda && (await checkHasNpp());
  return hasNpp;
};
