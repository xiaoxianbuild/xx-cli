import { Command } from 'commander';
import { list } from '../tools/package-manager/manager';
import Table from 'cli-table3';
import type { PackageInfo, PackageListInfo } from '../tools/package-manager/types';

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
    head: ['\x1b[1mManager\x1b[0m', '\x1b[1mName\x1b[0m', '\x1b[1mVersion\x1b[0m'],
    colWidths: [15, 40, 20],
    style: {
      head: [],
      border: ['grey'],
    },
  });

  for (const pkg of allPackages) {
    table.push([`\x1b[96m${pkg.manager}\x1b[0m`, pkg.name, pkg.version ? `\x1b[33m${pkg.version}\x1b[0m` : '-']);
  }

  console.log(table.toString());
}
