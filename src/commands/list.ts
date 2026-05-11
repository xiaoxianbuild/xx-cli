import { Command } from 'commander';
import { list } from '../tools/package-manager/manager';

export function createListCommand() {
  return new Command('list')
    .alias('ls')
    .description('list all installed packages')
    .action(async () => {
      try {
        const results = await list();
        for (const result of results) {
          if (result.packages.length > 0) {
            console.log(`\n--- ${result.manager} ---`);
            for (const pkg of result.packages) {
              const versionStr = pkg.version ? ` (${pkg.version})` : '';
              console.log(`${pkg.name}${versionStr}`);
            }
          }
        }
      } catch (error) {
        console.error('List failed:', (error as Error).message);
        process.exit(1);
      }
    });
}
