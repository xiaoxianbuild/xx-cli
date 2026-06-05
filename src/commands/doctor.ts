import { Command } from 'commander';
import os from 'node:os';
import Table from 'cli-table3';
import { color } from '../utils/color.ts';
import { getConfig } from '../config/config.ts';
import { checkBrewPackages, type PackageManagerDiffResult } from '../tools/package-manager/checker.ts';

export function createDoctorCommand() {
  return new Command('doctor')
    .description('doctor check xiaoxian cli environment')
    .option('-r, --raw', 'print raw doctor info')
    .action(async (options: { raw?: boolean }) => {
      const config = getConfig();
      const brewResult = await checkBrewPackages(config.packages.brew);

      if (options.raw) {
        printRawReport(brewResult);
      } else {
        printTableReport(brewResult);
      }
    });
}

function printRawReport(brewResult: PackageManagerDiffResult) {
  console.log(`Platform: ${os.platform()} ${os.arch()}`);
  console.log(`Bun Version: ${Bun.version}`);
  console.log(`Homebrew: ${brewResult.isManagerInstalled ? 'Installed' : 'Not Installed'}`);

  if (!brewResult.isManagerInstalled) return;

  if (brewResult.matched.length > 0) {
    console.log(`\nBrew Matched: ${brewResult.matched.join(', ')}`);
  }
  if (brewResult.missing.length > 0) {
    console.log(`Brew Missing: ${brewResult.missing.join(', ')}`);
  }
  if (brewResult.extra.length > 0) {
    console.log(`Brew Extra: ${brewResult.extra.join(', ')}`);
  }
}

function printTableReport(brewResult: PackageManagerDiffResult) {
  // --- Environment Table ---
  const envTable = new Table({
    head: [color.bold('Check'), color.bold('Status'), color.bold('Detail')],
    style: { head: [], border: ['grey'] },
  });

  envTable.push(
    [color.highlight('Platform'), color.success('✔'), `${os.platform()} ${os.arch()}`],
    [color.highlight('Bun Version'), color.success('✔'), Bun.version],
    [
      color.highlight('Homebrew'),
      brewResult.isManagerInstalled ? color.success('✔') : color.error('✘'),
      brewResult.isManagerInstalled ? 'Installed' : 'Not Installed',
    ],
  );

  console.log(`\n${color.bold('Xiaoxian CLI Doctor Report')}`);
  console.log(envTable.toString());

  if (!brewResult.isManagerInstalled) {
    console.log(color.warning('\n⚠  Homebrew is not installed. Skipping brew packages check.'));
    return;
  }

  const totalConfig = brewResult.matched.length + brewResult.missing.length;
  if (totalConfig === 0) {
    console.log(color.dim('\nNo brew packages declared in config. Skipping diff.'));
    return;
  }

  // --- Brew Packages Diff Table ---
  const diffTable = new Table({
    head: [color.bold('Package'), color.bold('Status')],
    style: { head: [], border: ['grey'] },
  });

  for (const name of brewResult.matched) {
    diffTable.push([color.green(name), color.success('✔ Installed')]);
  }
  for (const name of brewResult.missing) {
    diffTable.push([color.yellow(name), color.error('✘ Missing')]);
  }

  console.log(`\n${color.bold('Brew Packages (config vs system)')}`);
  console.log(diffTable.toString());

  // --- Summary ---
  console.log(
    `\n  ${color.success(`Matched: ${brewResult.matched.length}`)}  ${color.error(`Missing: ${brewResult.missing.length}`)}  ${color.dim(`Extra (not in config): ${brewResult.extra.length}`)}`,
  );

  if (brewResult.extra.length > 0) {
    console.log(`  ${color.dim(`Extra packages: ${brewResult.extra.join(', ')}`)}`);
  }
}
