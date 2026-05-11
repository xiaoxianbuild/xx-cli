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
    const infos = await this.infoPackages([packageName]);
    if (infos.length === 0) {
      return null;
    }
    return infos.find((info) => info.name === packageName) ?? null;
  }

  async infoPackages(packageNames: string[]): Promise<PackageDetailInfo[]> {
    if (packageNames.length === 0) return [];

    try {
      const infoResult = await $`brew info --json=v2 ${packageNames}`.quiet().nothrow();
      if (infoResult.exitCode !== 0) {
        return packageNames.map((name) => ({ manager: this.name, name }));
      }

      const data = JSON.parse(infoResult.stdout.toString());
      const packages: PackageDetailInfo[] = [];

      // Parse Formulae
      if (data.formulae) {
        for (const f of data.formulae) {
          const tags: string[] = [];
          if (f.deprecated) tags.push('deprecated');
          if (f.disabled) tags.push('disabled');

          packages.push({
            manager: this.name,
            name: f.name,
            type: 'Formula',
            description: f.desc,
            isInstalled: f.installed && f.installed.length > 0,
            tags: tags.length > 0 ? tags : undefined,
            version: f.versions?.stable,
          });
        }
      }

      // Parse Casks
      if (data.casks) {
        for (const c of data.casks) {
          const tags: string[] = [];
          if (c.deprecated) tags.push('deprecated');
          if (c.disabled) tags.push('disabled');

          packages.push({
            manager: this.name,
            name: c.token,
            type: 'Cask',
            description: c.desc,
            isInstalled: !!c.installed,
            tags: tags.length > 0 ? tags : undefined,
            version: c.version,
          });
        }
      }

      return packages;
    } catch (e) {
      console.warn('Failed to fetch brew info:', (e as Error).message);
      return packageNames.map((name) => ({ manager: this.name, name }));
    }
  }

  async searchPackages(query: string): Promise<PackageListInfo> {
    const searchResult = await $`brew search ${query}`.quiet().nothrow();
    if (searchResult.exitCode !== 0) {
      return { manager: this.name, packages: [] };
    }

    // Parse names from search output
    const names = searchResult.stdout
      .toString()
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('==> '))
      .flatMap((line) => line.split(/\s+/))
      .map((name) => name.replace(/✔$/, '').trim())
      .filter((name) => !!name);

    const packages = await this.infoPackages(names);

    return {
      manager: this.name,
      packages,
    };
  }
}
