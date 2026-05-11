import { Command } from 'commander';
import { info } from '../tools/package-manager/manager';

export function createInfoCommand() {
  return new Command('info')
    .description('show information for a package')
    .argument('<package>', 'package to show info')
    .action(async (packageName) => {
      try {
        const results = await info(packageName);
        if (results.length === 0) {
          console.warn(`No package manager supports package: ${packageName}`);
          return;
        }

        for (const result of results) {
          console.log(`\n--- ${result.manager} info ---`);
          if (result.rawInfo) {
            console.log(result.rawInfo);
          } else {
            console.log(`Name: ${result.name}`);
            if (result.version) console.log(`Version: ${result.version}`);
            if (result.description) console.log(`Description: ${result.description}`);
          }
        }
      } catch (error) {
        console.error('Info failed:', (error as Error).message);
        process.exit(1);
      }
    });
}
