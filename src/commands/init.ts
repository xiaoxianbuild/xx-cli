import { Command } from 'commander';
import { initConfig, ConfigFile } from '../config/config.ts';

export function createInitCommand() {
  return new Command('init').description('init xiaoxian cli').action(() => {
    initConfig();
    console.log('init called, config file is', ConfigFile);
  });
}
