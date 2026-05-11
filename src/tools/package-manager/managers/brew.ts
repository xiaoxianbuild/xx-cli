import { $ } from 'bun';
import type { PackageManager, PackageListInfo, PackageDetailInfo, PackageInfo } from '../types';
import { checkExecutableInPath } from '../../../utils/system';

/**
 * BrewProcessor 实现了 PackageManager 接口，通过 Homebrew 管理系统包。
 */
export class BrewPackageManager implements PackageManager {
  name = 'brew';

  async check(): Promise<boolean> {
    return checkExecutableInPath('brew');
  }

  async checkPackage(packageName: string): Promise<boolean> {
    const result = await $`brew list ${packageName}`.quiet().nothrow();
    return result.exitCode === 0;
  }

  async supportsPackage(packageName: string): Promise<boolean> {
    // 作为通用管理器，在 macOS/Linux 上默认支持
    // noinspection SpellCheckingInspection
    if (process.platform !== 'darwin' && process.platform !== 'linux') {
      return false;
    }
    const result = await $`brew info ${packageName}`.quiet().nothrow();
    return result.exitCode === 0;
  }

  async installPackage(packageName: string): Promise<void> {
    if (!(await this.check())) {
      throw new Error('Homebrew is not installed. Please install it first: https://brew.sh/');
    }

    if (await this.checkPackage(packageName)) {
      throw new Error(`Package ${packageName} already installed, skipping installation...`);
    }

    console.log(`Installing ${packageName} via Homebrew...`);
    const result = await $`brew install ${packageName}`.nothrow();
    if (result.exitCode !== 0) {
      throw new Error(`Failed to install ${packageName} via Homebrew`);
    }
  }

  async upgradePackage(packageName: string): Promise<void> {
    if (!(await this.checkPackage(packageName))) {
      return console.log(`Package ${packageName} not installed, skipping upgrade...`);
    }

    console.log(`Upgrading ${packageName} via Homebrew...`);
    const result = await $`brew upgrade ${packageName}`.nothrow();
    if (result.exitCode !== 0) {
      throw new Error(`Failed to upgrade ${packageName} via Homebrew`);
    }
  }

  async uninstallPackage(packageName: string): Promise<void> {
    if (!(await this.check())) {
      throw new Error('Homebrew is not installed.');
    }

    console.log(`Uninstalling ${packageName} via Homebrew...`);
    const result = await $`brew uninstall ${packageName}`;
    if (result.exitCode !== 0) {
      throw new Error(`Failed to uninstall ${packageName} via Homebrew`);
    }
  }

  async listPackages(): Promise<PackageListInfo> {
    const text = await $`brew list --versions`.quiet().text();
    const packages: PackageInfo[] = text
      .trim()
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => {
        const [name, ...versionParts] = line.trim().split(/\s+/);
        return {
          name: name?.trim() ?? '',
          version: versionParts.join(' '),
        };
      })
      .filter((p) => !!p.name);

    return {
      manager: this.name,
      packages,
    };
  }

  async infoPackage(packageName: string): Promise<PackageDetailInfo | null> {
    const result = await $`brew info ${packageName}`.quiet().nothrow();
    if (result.exitCode !== 0) {
      return null;
    }
    const rawInfo = result.stdout.toString().trim();
    return {
      manager: this.name,
      name: packageName,
      rawInfo,
    };
  }
}
