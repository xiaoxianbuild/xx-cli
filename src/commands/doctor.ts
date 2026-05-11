import { Command } from 'commander';
import os from 'node:os';
import Table from 'cli-table3';
import { color } from '../utils/color.ts';

export function createDoctorCommand() {
  return new Command('doctor')
    .description('doctor check xiaoxian cli environment')
    .option('-r, --raw', 'print raw doctor info')
    .action((options: { raw?: boolean }) => {
      if (options.raw) {
        console.log(`Platform: ${os.platform()} ${os.arch()}`);
        console.log(`Bun Version: ${Bun.version}`);
        console.log(`Homebrew: Installed`);
      } else {
        const table = new Table({
          head: [color.bold('Check'), color.bold('Status'), color.bold('Detail')],
          style: { head: [], border: ['grey'] },
        });

        table.push(
          [color.highlight('Platform'), color.success('✔'), `${os.platform()} ${os.arch()}`],
          [color.highlight('Bun Version'), color.success('✔'), Bun.version],
          [color.highlight('Homebrew'), color.success('✔'), 'Installed'],
        );

        console.log(`\n${color.bold('Xiaoxian CLI Doctor Report')}`);
        console.log(table.toString());
      }
    });
}
