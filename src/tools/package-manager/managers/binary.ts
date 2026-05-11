import type {
  PackageManager,
  BinaryPackageProcessor,
  PackageListInfo,
  PackageDetailInfo,
  PackageInfo,
} from '../types.ts';

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

  async supportsPackage(packageName: string): Promise<boolean> {
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

  async listPackages(): Promise<PackageListInfo> {
    const checkResults = await Promise.all(
      Array.from(this.processors).map(async ([name, processor]) => {
        const isInstalled = await processor.check();
        return isInstalled ? name : null;
      }),
    );
    const packages: PackageInfo[] = checkResults
      .filter((name): name is string => name !== null)
      .map((name) => ({ name }));

    return {
      manager: this.name,
      packages,
    };
  }

  async infoPackage(packageName: string): Promise<PackageDetailInfo | null> {
    const processor = this.processors.get(packageName);
    if (processor) {
      return {
        manager: this.name,
        name: packageName,
        description: 'Managed by BinaryPackageManager',
      };
    }
    return null;
  }

  async infoPackages(packageNames: string[]): Promise<PackageDetailInfo[]> {
    const results: PackageDetailInfo[] = [];
    for (const name of packageNames) {
      const info = await this.infoPackage(name);
      if (info) results.push(info);
    }
    return results;
  }

  async searchPackages(query: string): Promise<PackageListInfo> {
    const packages: PackageInfo[] = Array.from(this.processors.keys())
      .filter((name) => name.toLowerCase().includes(query.toLowerCase()))
      .map((name) => ({ name }));

    return {
      manager: this.name,
      packages,
    };
  }
}
