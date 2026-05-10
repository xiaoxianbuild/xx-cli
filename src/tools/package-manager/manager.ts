import type { PackageManager } from './types';
import { BinaryPackageManager } from './managers/binary.ts';
import { AsdfProcessor } from './packages/asdf.ts';

const managers: PackageManager[] = [new BinaryPackageManager([new AsdfProcessor()])];

export async function install(packageName: string): Promise<void> {
  for (const manager of managers) {
    if (manager.supportsPackage(packageName)) {
      await manager.installPackage(packageName);
      return;
    }
  }
  throw new Error(`Does not support install this package: ${packageName}`);
}

export async function upgrade(packageName: string): Promise<void> {
  for (const manager of managers) {
    if (manager.supportsPackage(packageName)) {
      await manager.upgradePackage(packageName);
      return;
    }
  }
  throw new Error(`Does not support upgrade this package: ${packageName}`);
}

export async function uninstall(packageName: string): Promise<void> {
  for (const manager of managers) {
    if (manager.supportsPackage(packageName)) {
      await manager.uninstallPackage(packageName);
      return;
    }
  }
  throw new Error(`Does not support uninstall this package: ${packageName}`);
}
