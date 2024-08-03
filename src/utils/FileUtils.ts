import { exec } from "child_process";
import { promisify } from "util";
import { checkHasCuda, checkHasGPU, checkHasNpp } from "../utils/SystemUtils";
import fs from "fs/promises";

const execPromise = promisify(exec);

const runFFmpegCommand = async (command: string) => {
  try {
    const { stdout } = await execPromise(command);
    return stdout;
  } catch (error) {
    throw error;
  }
};

export const writeVideo = async (
  input: string,
  output: string,
  options: string
) => {
  const command = `ffmpeg -i ${input} ${options} ${output}`;
  return runFFmpegCommand(command);
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
    await fs.writeFile(fileListPath, fileList);
    command = `ffmpeg -f concat -safe 0 -i ${fileListPath} ${options} ${output}`;
  }
  console.log(command);
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
