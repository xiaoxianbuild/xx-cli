import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

export function getHome() {
  return os.homedir();
}

export function getEnvWithDefault(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

export function getXDGConfigHome() {
  return getEnvWithDefault('XDG_CONFIG_HOME', path.join(getHome(), '.config'));
}

export function getXDGDataHome() {
  return getEnvWithDefault('XDG_DATA_HOME', path.join(getHome(), '.local', 'share'));
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
  return fs.readFileSync(file, 'utf-8');
}

export function checkExecutableInPath(exe: string): boolean {
  return Bun.which(exe) !== null;
}

export function getBinHome(): string {
  return path.join(getHome(), '.local', 'bin');
}
