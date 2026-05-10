import { Command } from 'commander';
import { upgrade } from '../tools/package-manager/manager';

export function createUpgradeCommand() {
  return new Command('upgrade')
    .description('upgrade packages')
    .argument('<package>', 'package to upgrade')
    .action(async (packageName) => {
      try {
        await upgrade(packageName);
      } catch (error) {
        console.error('Upgrade failed:', (error as Error).message);
        process.exit(1);
      }
    });
}
