import { Command } from 'commander';
import { info } from '../tools/package-manager/manager';
import Table from 'cli-table3';
import type { PackageDetailInfo } from '../tools/package-manager/types';
import { color } from '../utils/color';

export function createInfoCommand() {
  return new Command('info')
    .description('show information for a package')
    .argument('<package>', 'package to show info')
    .option('-r, --raw', 'print raw info format')
    .action(async (packageName, options: { raw?: boolean }) => {
      try {
        const results = await info(packageName);
        if (results.length === 0) {
          console.warn(`No package manager supports package: ${packageName}`);
          return;
        }

        if (options.raw) {
          for (const result of results) {
            console.log(`\n--- ${result.manager} info ---`);
            printRawInfo(result);
          }
        } else {
          // Unified table format
          printInfoTable(results);

          // Print raw info if available (outside the table)
          for (const result of results) {
            if (result.rawInfo) {
              console.log(`\n--- ${result.manager} Raw Output ---`);
              console.log(result.rawInfo);
            }
          }
        }
      } catch (error) {
        console.error('Info failed:', (error as Error).message);
        process.exit(1);
      }
    });
}

function printRawInfo(info: PackageDetailInfo) {
  if (info.rawInfo) {
    console.log(info.rawInfo);
  } else {
    console.log(`Name: ${info.name}`);
    if (info.version) console.log(`Version: ${info.version}`);
    if (info.description) console.log(`Description: ${info.description}`);
    if (info.tags) console.log(`Tags: ${info.tags.join(', ')}`);
    if (info.type) console.log(`Type: ${info.type}`);
  }
}

function printInfoTable(infos: PackageDetailInfo[]) {
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
      head: [],
      border: ['grey'],
    },
  });

  for (const info of infos) {
    table.push([
      color.cyan(info.manager),
      info.name,
      info.version ? color.warning(info.version) : '-',
      info.type || '-',
      info.tags ? color.dim(info.tags.join(', ')) : '-',
      info.description || '-',
    ]);
  }

  console.log(table.toString());
}
