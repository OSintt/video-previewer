import { exec } from "child_process";
import { promisify } from "util";
import os from "os";

const execPromise = promisify(exec);

async function runCommand(command: string): Promise<string> {
  try {
    const { stdout } = await execPromise(command);
    return stdout;
  } catch (error) {
    return "";
  }
}

export async function checkHasGPU(): Promise<boolean> {
  const platform = os.platform();
  let command: string;

  if (platform === "win32") {
    command = "wmic path win32_VideoController get caption";
  } else if (platform === "linux") {
    command = "lspci | grep -i nvidia";
  } else {
    return false;
  }
  const stdout = await runCommand(command);
  return stdout.toLowerCase().includes("nvidia");
}

export async function checkHasCuda(): Promise<boolean> {
  const platform = os.platform();
  let command: string;

  if (platform === "win32") {
    command = "nvcc --version";
  } else if (platform === "linux") {
    command = "nvcc --version";
  } else {
    return false;
  }
  const stdout = await runCommand(command);
  return stdout.includes("release");
}

export async function checkHasNpp(): Promise<boolean> {
  const platform = os.platform();
  let command: string;

  if (platform === "win32") {
    command = "nvidia-smi";
  } else if (platform === "linux") {
    command = "nvidia-smi";
  } else {
    return false;
  }
  const stdout = await runCommand(command);
  return stdout.includes("NPP");
}
