import { Command } from 'commander';
import { search } from '../tools/package-manager/manager';
import Table from 'cli-table3';

export function createSearchCommand() {
  return new Command('search')
    .alias('s')
    .description('search for packages')
    .argument('<query>', 'package name query')
    .option('-r, --raw', 'print raw list format')
    .action(async (query: string, options: { raw?: boolean }) => {
      try {
        const results = await search(query);
        for (const result of results) {
          if (result.packages.length > 0) {
            console.log(`\n--- ${result.manager} ---`);

            if (options.raw) {
              printRawList(result.packages);
            } else {
              printTable(result.packages);
            }
          }
        }
      } catch (error) {
        console.error('Search failed:', (error as Error).message);
        process.exit(1);
      }
    });
}

function printRawList(packages: any[]) {
  const groups: Record<string, any[]> = {};
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
      const installedMark = pkg.isInstalled ? ' \x1b[32m✔\x1b[0m' : '';
      const tagsStr = pkg.tags ? ` \x1b[90m(${pkg.tags.join(', ')})\x1b[0m` : '';
      const versionStr = pkg.version ? ` \x1b[33m${pkg.version}\x1b[0m` : '';
      const descStr = pkg.description ? ` - ${pkg.description}` : '';
      console.log(`  ${pkg.name}${versionStr}${installedMark}${tagsStr}${descStr}`);
    }
  }
}

function printTable(packages: any[]) {
  const table = new Table({
    head: [
      '\x1b[1mName\x1b[0m',
      '\x1b[1mVersion\x1b[0m',
      '\x1b[1mType\x1b[0m',
      '\x1b[1mTags\x1b[0m',
      '\x1b[1mDescription\x1b[0m',
    ],
    colWidths: [30, 15, 10, 15, 50],
    wordWrap: true,
    style: {
      head: [], // Disable default colors to use our own
      border: ['grey'],
    },
  });

  for (const pkg of packages) {
    const nameCol = pkg.name + (pkg.isInstalled ? ' \x1b[32m✔\x1b[0m' : '');
    const versionCol = pkg.version ? `\x1b[33m${pkg.version}\x1b[0m` : '-';
    const typeCol = pkg.type || '-';
    const tagsCol = pkg.tags ? `\x1b[90m${pkg.tags.join(', ')}\x1b[0m` : '-';
    const descCol = pkg.description || '';

    table.push([nameCol, versionCol, typeCol, tagsCol, descCol]);
  }

  console.log(table.toString());
}
