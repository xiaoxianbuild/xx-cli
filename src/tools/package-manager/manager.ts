import type { PackageManager } from './types';
import { BinaryPackageManager } from './managers/binary';
import { BrewPackageManager } from './managers/brew';
import { AsdfProcessor } from './packages/asdf';

// 直接在 managers 列表中包含不同的管理器实现
const managers: PackageManager[] = [new BinaryPackageManager([new AsdfProcessor()]), new BrewPackageManager()];

export async function install(packageName: string): Promise<void> {
  for (const manager of managers) {
    if (!manager.supportsPackage(packageName)) {
      continue;
    }
    // 如果已经安装了，直接返回成功
    if (await manager.checkPackage(packageName)) {
      console.log(`${packageName} is already installed via ${manager.name}`);
      return;
    }
    try {
      await manager.installPackage(packageName);
      return;
    } catch (e) {
      console.warn(`${manager.name} install ${packageName} failed: ${(e as Error).message}`);
    }
  }
  throw new Error(`Does not support install this package: ${packageName}`);
}

export async function upgrade(packageName: string): Promise<void> {
  for (const manager of managers) {
    if (!manager.supportsPackage(packageName)) {
      continue;
    }
    try {
      await manager.upgradePackage(packageName);
      return;
    } catch (e) {
      console.warn(`${manager.name} upgrade ${packageName} failed: ${(e as Error).message}`);
    }
  }
  throw new Error(`Does not support upgrade this package: ${packageName}`);
}

export async function uninstall(packageName: string): Promise<void> {
  for (const manager of managers) {
    if (!manager.supportsPackage(packageName)) {
      continue;
    }
    try {
      await manager.uninstallPackage(packageName);
      return;
    } catch (e) {
      console.warn(`${manager.name} uninstall ${packageName} failed: ${(e as Error).message}`);
    }
  }
  throw new Error(`Does not support uninstall this package: ${packageName}`);
}
