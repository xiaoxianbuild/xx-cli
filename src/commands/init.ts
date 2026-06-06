import { Command } from 'commander';
import Table from 'cli-table3';
import { initConfig, ConfigFile, type ConfigDiff } from '../config/config.ts';
import { color } from '../utils/color.ts';

export function createInitCommand() {
  return new Command('init').description('init xiaoxian cli').action(() => {
    const diff = initConfig();

    if (diff === null) {
      console.log(color.success('✔ Config file created:'), ConfigFile);
      return;
    }

    console.log(color.dim('Config file already exists:'), ConfigFile);

    if (diff.added.length === 0 && diff.removed.length === 0 && diff.changed.length === 0) {
      console.log(color.success('✔ Config is up to date, no differences found.'));
      return;
    }

    printConfigDiff(diff);
  });
}

function printConfigDiff(diff: ConfigDiff) {
  const table = new Table({
    head: [color.bold('Key'), color.bold('Status'), color.bold('Detail')],
    style: { head: [], border: ['grey'] },
  });

  for (const item of diff.added) {
    table.push([color.cyan(item.key), color.info('+ New default'), color.dim(formatValue(item.value))]);
  }
  for (const item of diff.removed) {
    table.push([color.yellow(item.key), color.warning('- Not in defaults'), color.dim(formatValue(item.value))]);
  }
  for (const item of diff.changed) {
    table.push([
      color.highlight(item.key),
      color.warning('≠ Different'),
      `${color.error(formatValue(item.oldValue))} → ${color.success(formatValue(item.newValue))}`,
    ]);
  }

  console.log(`\n${color.bold('Config Diff (existing vs defaults)')}`);
  console.log(table.toString());
  console.log(color.dim('\nTo reset to defaults, delete the config file and run `xx init` again.'));
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.join(', ')}]`;
  }
  return String(value);
}
