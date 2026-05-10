import { Command } from 'commander';

const SEPARATOR = ':';

function printEnv(vars: string[], options: any) {
  if (!options.multi && vars.length > 1) {
    console.error('print command does not accept multiple arguments without --multi flag');
    process.exit(1);
  }

  for (const name of vars) {
    if (options.withName) {
      console.log(`[${name}]`);
    }
    const value = process.env[name] || '';
    if (options.raw) {
      console.log(value);
    } else {
      // Split by separator and join with newline for readability
      console.log(value.split(SEPARATOR).join('\n'));
    }
  }
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
