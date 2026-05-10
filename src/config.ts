import path from 'node:path';
import yaml from 'js-yaml';
import { getXDGConfigHome, mustMkdir, hasFile, writeFile, readFile } from './utils/system';

export const ConfigFile = path.join(getXDGConfigHome(), 'xiaoxian.yaml');

const SampleConfig = `version: 0.0.1
`;

export interface Config {
  version: string;
}

export function initConfig() {
  mustMkdir(getXDGConfigHome());
  if (!hasFile(ConfigFile)) {
    writeFile(ConfigFile, SampleConfig);
  }
}

let config: Config | null = null;

export function getConfig(): Config {
  if (!config) {
    const data = readFile(ConfigFile);
    config = yaml.load(data) as Config;
  }
  return config;
}
