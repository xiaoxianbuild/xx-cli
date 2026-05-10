import { Command } from 'commander';
import { uninstall } from '../tools/package_manager/manager';

export function createUninstallCommand() {
  return new Command('uninstall')
    .description('uninstall packages')
    .argument('<package>', 'package to uninstall')
    .action(async (packageName) => {
      try {
        await uninstall(packageName);
      } catch (error) {
        console.error('Uninstall failed:', (error as Error).message);
        process.exit(1);
      }
    });
}
