import { Command } from 'commander';
import { BuildTime, Commit, Version } from '../constants';
import Table from 'cli-table3';
import { color } from '../utils/color';

export function createVersionCommand() {
  return new Command('version')
    .description('version of the CLI')
    .option('-r, --raw', 'print raw version info')
    .action((options: { raw?: boolean }) => {
      if (options.raw) {
        console.log(`Version: ${Version}`);
        console.log(`BuildTime: ${BuildTime}`);
        console.log(`Commit: ${Commit}`);
        console.log(`BunVersion: ${Bun.version}`);
        console.log(`Platform: ${process.platform} ${process.arch}`);
      } else {
        const table = new Table({
          style: { border: ['grey'] },
          colWidths: [15, 60],
        });
        table.push(
          { [color.highlight('Version')]: Version },
          { [color.highlight('BuildTime')]: BuildTime },
          { [color.highlight('Commit')]: Commit },
          { [color.highlight('BunVersion')]: Bun.version },
          { [color.highlight('Platform')]: `${process.platform} ${process.arch}` },
        );
        console.log(table.toString());
      }
    });
}
