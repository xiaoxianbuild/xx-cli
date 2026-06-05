import path from 'node:path';
import { getXDGConfigHome, mustMkdir, hasFile, writeFile, readFile } from '../utils/system';
import { type Config, ConfigSchema } from './types.ts';

const configPath = path.join(getXDGConfigHome(), 'xiaoxian');
const configFileName = 'xx.json';
export const ConfigFile = path.join(configPath, configFileName);

export function initConfig() {
  mustMkdir(configPath);
  if (!hasFile(ConfigFile)) {
    const sampleConfig = ConfigSchema.parse({});
    const sampleConfigString = JSON.stringify(sampleConfig, null, 2);
    writeFile(ConfigFile, sampleConfigString + '\n');
  }
  getConfig(); // check config valid
}

export function getConfig(): Config {
  const data = readFile(ConfigFile);
  const obj = JSON.parse(data);
  return ConfigSchema.parse(obj);
}
