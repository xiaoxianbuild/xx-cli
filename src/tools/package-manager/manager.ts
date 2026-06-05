import type { PackageManager, PackageListInfo, PackageDetailInfo } from './types';
import { BinaryPackageManager } from './managers/binary';
import { BrewPackageManager } from './managers/brew';
import { AsdfProcessor } from './packages/asdf';

// 直接在 managers 列表中包含不同的管理器实现
export const managers: PackageManager[] = [new BinaryPackageManager([new AsdfProcessor()]), new BrewPackageManager()];

export async function install(packageName: string): Promise<void> {
  for (const manager of managers) {
    if (!(await manager.supportsPackage(packageName))) {
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
    if (!(await manager.supportsPackage(packageName))) {
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
    if (!(await manager.supportsPackage(packageName))) {
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

export async function list(): Promise<PackageListInfo[]> {
  const results = await Promise.all(
    managers.map(async (manager) => {
      if (await manager.check()) {
        return await manager.listPackages();
      }
      return null;
    }),
  );
  return results.filter((r): r is PackageListInfo => r !== null);
}

export async function info(packageName: string): Promise<PackageDetailInfo[]> {
  const results = await Promise.all(
    managers.map(async (manager) => {
      if (await manager.supportsPackage(packageName)) {
        return await manager.infoPackage(packageName);
      }
      return null;
    }),
  );
  return results.filter((r): r is PackageDetailInfo => r !== null);
}

export async function search(query: string): Promise<PackageListInfo[]> {
  const results = await Promise.all(
    managers.map(async (manager) => {
      if (await manager.check()) {
        return await manager.searchPackages(query);
      }
      return null;
    }),
  );
  return results.filter((r): r is PackageListInfo => r !== null);
}
