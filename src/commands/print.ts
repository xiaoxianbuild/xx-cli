import { Command } from 'commander';
import Table from 'cli-table3';
import { color } from '../utils/color';

const SEPARATOR = ':';

function printEnv(vars: string[], options: any) {
  if (!options.multi && vars.length > 1) {
    console.error('print command does not accept multiple arguments without --multi flag');
    process.exit(1);
  }

  if (options.raw) {
    for (const name of vars) {
      if (options.withName) console.log(`[${name}]`);
      console.log(process.env[name] || '');
    }
    return;
  }

  const table = new Table({
    head: [color.bold('Variable'), color.bold('Value')],
    colWidths: [20, 80],
    wordWrap: true,
    style: { head: [], border: ['grey'] },
  });

  for (const name of vars) {
    const value = process.env[name] || '';
    const parts = value.split(SEPARATOR);
    const seen = new Set<string>();
    const displayParts = parts.map((part) => {
      if (!part) return part;
      if (seen.has(part)) {
        return color.warning(part); // Highlight duplicate in yellow
      }
      seen.add(part);
      return part;
    });

    const displayValue = displayParts.join('\n');
    table.push([color.highlight(name), displayValue]);
  }

  console.log(table.toString());
}

export function createPrintCommand() {
  const printCommand = new Command('print')
    .description('print something')
    .argument('<vars...>', 'variables to print')
    .action(() => {
      console.log('print called, use subcommand to print different things');
    });

  const envCommand = new Command('env')
    .description('print env variable')
    .option('-r, --raw', 'raw print')
    .option('-n, --with-name', 'print with name')
    .option('-m, --multi', 'print with multi variables')
    .argument('<vars...>', 'variables to print')
    .action(printEnv);

  printCommand.addCommand(envCommand);

  return printCommand;
}
