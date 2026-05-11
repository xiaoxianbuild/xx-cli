import { Command } from 'commander';
import { search } from '../tools/package-manager/manager';
import Table from 'cli-table3';
import type { PackageInfo, PackageListInfo } from '../tools/package-manager/types';
import { color } from '../utils/color';

export function createSearchCommand() {
  return new Command('search')
    .alias('s')
    .description('search for packages')
    .argument('<query>', 'package name query')
    .option('-r, --raw', 'print raw list format')
    .action(async (query: string, options: { raw?: boolean }) => {
      try {
        const results = await search(query);
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
        console.error('Search failed:', (error as Error).message);
        process.exit(1);
      }
    });
}

function printRawList(packages: PackageInfo[]) {
  const groups: Record<string, PackageInfo[]> = {};
  for (const pkg of packages) {
    const type = pkg.type || 'Other';
    if (!groups[type]) groups[type] = [];
    groups[type].push(pkg);
  }

  for (const [type, pkgs] of Object.entries(groups)) {
    if (Object.keys(groups).length > 1 || type !== 'Other') {
      console.log(`\n[${type}]`);
    }
    for (const pkg of pkgs) {
      const installedMark = pkg.isInstalled ? ` ${color.success('✔')}` : '';
      const tagsStr = pkg.tags ? ` ${color.dim(`(${pkg.tags.join(', ')})`)}` : '';
      const versionStr = pkg.version ? ` ${color.warning(pkg.version)}` : '';
      const descStr = pkg.description ? ` - ${pkg.description}` : '';
      console.log(`  ${pkg.name}${versionStr}${installedMark}${tagsStr}${descStr}`);
    }
  }
}

function printTable(results: PackageListInfo[]) {
  const allPackages = results.flatMap((r) => r.packages.map((pkg) => ({ ...pkg, manager: r.manager })));

  if (allPackages.length === 0) return;

  const table = new Table({
    head: [
      color.bold('Manager'),
      color.bold('Name'),
      color.bold('Version'),
      color.bold('Type'),
      color.bold('Tags'),
      color.bold('Description'),
    ],
    colWidths: [10, 25, 15, 10, 15, 45],
    wordWrap: true,
    style: {
      head: [], // Disable default colors to use our own
      border: ['grey'],
    },
  });

  for (const pkg of allPackages) {
    const managerCol = color.cyan(pkg.manager);
    const nameCol = pkg.name + (pkg.isInstalled ? ` ${color.success('✔')}` : '');
    const versionCol = pkg.version ? color.warning(pkg.version) : '-';
    const typeCol = pkg.type || '-';
    const tagsCol = pkg.tags ? color.dim(pkg.tags.join(', ')) : '-';
    const descCol = pkg.description || '';

    table.push([managerCol, nameCol, versionCol, typeCol, tagsCol, descCol]);
  }

  console.log(table.toString());
}
