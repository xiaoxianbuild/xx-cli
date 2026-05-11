import { Command } from 'commander';
import { list } from '../tools/package-manager/manager';
import Table from 'cli-table3';
import type { PackageInfo, PackageListInfo } from '../tools/package-manager/types';
import { color } from '../utils/color';

export function createListCommand() {
  return new Command('list')
    .alias('ls')
    .description('list all installed packages')
    .option('-r, --raw', 'print raw list format')
    .action(async (options: { raw?: boolean }) => {
      try {
        const results = await list();
        if (options.raw) {
          for (const result of results) {
            if (result.packages.length > 0) {
              console.log(`\n--- ${result.manager} ---`);
              printRawList(result.packages);
            }
          }
        } else {
          printTable(results);
        }
      } catch (error) {
        console.error('List failed:', (error as Error).message);
        process.exit(1);
      }
    });
}

function printRawList(packages: PackageInfo[]) {
  for (const pkg of packages) {
    const versionStr = pkg.version ? ` (${pkg.version})` : '';
    console.log(`${pkg.name}${versionStr}`);
  }
}

function printTable(results: PackageListInfo[]) {
  const allPackages = results.flatMap((r) => r.packages.map((pkg) => ({ ...pkg, manager: r.manager })));

  if (allPackages.length === 0) return;

  const table = new Table({
    head: [color.bold('Manager'), color.bold('Name'), color.bold('Version')],
    colWidths: [15, 40, 20],
    style: {
      head: [],
      border: ['grey'],
    },
  });

  for (const pkg of allPackages) {
    table.push([color.cyan(pkg.manager), pkg.name, pkg.version ? color.warning(pkg.version) : '-']);
  }

  console.log(table.toString());
}
