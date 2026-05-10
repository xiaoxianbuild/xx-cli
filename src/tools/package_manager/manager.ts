import type { PackageManager, PackageProcessor } from './types';
import { AsdfProcessor } from './plugins/asdf';

class BinaryPackageManager implements PackageManager {
  name = 'binary';
  private processors: Map<string, PackageProcessor> = new Map();

  constructor() {
    const asdf = new AsdfProcessor();
    this.processors.set(asdf.name, asdf);
    this.processors.set('uv', asdf);
  }

  async check(): Promise<boolean> {
    return true;
  }

  async checkPackage(packageName: string): Promise<boolean> {
    const processor = this.processors.get(packageName);
    return processor ? await processor.check() : false;
  }

  supportsPackage(packageName: string): boolean {
    return this.processors.has(packageName);
  }

  async installPackage(packageName: string): Promise<void> {
    const processor = this.processors.get(packageName);
    if (processor) {
      await processor.install();
    } else {
      throw new Error(`Package ${packageName} not supported by binary manager`);
    }
  }

  async upgradePackage(packageName: string): Promise<void> {
    const processor = this.processors.get(packageName);
    if (processor) {
      await processor.upgrade();
    } else {
      throw new Error(`Package ${packageName} not supported by binary manager`);
    }
  }

  async uninstallPackage(packageName: string): Promise<void> {
    const processor = this.processors.get(packageName);
    if (processor) {
      await processor.uninstall();
    } else {
      throw new Error(`Package ${packageName} not supported by binary manager`);
    }
  }
}

const managers: PackageManager[] = [new BinaryPackageManager()];

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
