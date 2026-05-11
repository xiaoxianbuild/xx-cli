import { Command } from 'commander';
import { info } from '../tools/package-manager/manager';
import Table from 'cli-table3';
import type { PackageDetailInfo } from '../tools/package-manager/types';

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
      '\x1b[1mManager\x1b[0m',
      '\x1b[1mName\x1b[0m',
      '\x1b[1mVersion\x1b[0m',
      '\x1b[1mType\x1b[0m',
      '\x1b[1mTags\x1b[0m',
      '\x1b[1mDescription\x1b[0m',
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
      `\x1b[96m${info.manager}\x1b[0m`,
      info.name,
      info.version ? `\x1b[33m${info.version}\x1b[0m` : '-',
      info.type || '-',
      info.tags ? `\x1b[90m${info.tags.join(', ')}\x1b[0m` : '-',
      info.description || '-',
    ]);
  }

  console.log(table.toString());
}
