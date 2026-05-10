import { Command } from 'commander';
import { BuildTime, Commit, Version } from '../constants';

export function createVersionCommand() {
  return new Command('version').description('version of the CLI').action(() => {
    console.log(`Version: ${Version}`);
    console.log(`BuildTime: ${BuildTime}`);
    console.log(`Commit: ${Commit}`);
    console.log(`BunVersion: ${Bun.version}`);
    console.log(`Platform: ${process.platform} ${process.arch}`);
  });
}
