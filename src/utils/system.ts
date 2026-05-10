import os from "os";
import path from "path";
import fs from "fs";

export function getHome() {
  return os.homedir();
}

export function getEnvWithDefault(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

export function getXDGConfigHome() {
  return getEnvWithDefault(
    "XDG_CONFIG_HOME",
    path.join(getHome(), ".config")
  );
}

export function getXDGDataHome() {
  return getEnvWithDefault(
    "XDG_DATA_HOME",
    path.join(getHome(), ".local", "share")
  );
}

export function mustMkdir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function hasFile(file: string) {
  return fs.existsSync(file);
}

export function writeFile(file: string, content: string) {
  fs.writeFileSync(file, content);
}

export function readFile(file: string): string {
  return fs.readFileSync(file, "utf-8");
}
