import type { PackageManager } from '../types';
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
    if (!(await this.check())) return false;
    const result = await Bun.$`brew list ${packageName}`.quiet();
    return result.exitCode === 0;
  }

  supportsPackage(packageName: string): boolean {
    // 作为通用管理器，在 macOS/Linux 上默认支持
    return process.platform === 'darwin' || process.platform === 'linux';
  }

  async installPackage(packageName: string): Promise<void> {
    if (!(await this.check())) {
      throw new Error('Homebrew is not installed. Please install it first: https://brew.sh/');
    }

    console.log(`Installing ${packageName} via Homebrew...`);
    const result = await Bun.$`brew install ${packageName}`;
    if (result.exitCode !== 0) {
      throw new Error(`Failed to install ${packageName} via Homebrew`);
    }
  }

  async upgradePackage(packageName: string): Promise<void> {
    if (!(await this.check())) {
      throw new Error('Homebrew is not installed.');
    }

    console.log(`Upgrading ${packageName} via Homebrew...`);
    const result = await Bun.$`brew upgrade ${packageName}`;
    if (result.exitCode !== 0) {
      throw new Error(`Failed to upgrade ${packageName} via Homebrew`);
    }
  }

  async uninstallPackage(packageName: string): Promise<void> {
    if (!(await this.check())) {
      throw new Error('Homebrew is not installed.');
    }

    console.log(`Uninstalling ${packageName} via Homebrew...`);
    const result = await Bun.$`brew uninstall ${packageName}`;
    if (result.exitCode !== 0) {
      throw new Error(`Failed to uninstall ${packageName} via Homebrew`);
    }
  }
}
