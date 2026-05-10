import type { PackageManager, BinaryPackageProcessor } from '../types.ts';

export class BinaryPackageManager implements PackageManager {
  name = 'binary';
  private processors: Map<string, BinaryPackageProcessor> = new Map();

  constructor(Recordset: BinaryPackageProcessor[]) {
    for (const processor of Recordset) {
      this.processors.set(processor.name, processor);
    }
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
