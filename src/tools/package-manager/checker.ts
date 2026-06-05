import { managers } from './manager.ts';

export interface PackageManagerDiffResult {
  /** brew 是否已安装 */
  isManagerInstalled: boolean;
  /** 配置中声明但系统未安装的包 */
  missing: string[];
  /** 系统已安装但配置中未声明的包 */
  extra: string[];
  /** 配置中声明且系统已安装的包 */
  matched: string[];
}

/**
 * 对比配置中声明的 brew 包与系统实际安装的 brew 包，返回差异结果。
 */
export async function checkBrewPackages(configPackages: string[]): Promise<PackageManagerDiffResult> {
  const brew = managers.find((m) => m.name === 'brew');
  if (!brew) throw new Error('Brew package manager not found');

  const isBrewInstalled = await brew.check();
  if (!isBrewInstalled) {
    return { isManagerInstalled: false, missing: [], extra: [], matched: [] };
  }

  const listInfo = await brew.listPackages();
  const installedNames = new Set(listInfo.packages.map((p) => p.name));
  const configNames = new Set(configPackages);

  const missing: string[] = [];
  const matched: string[] = [];
  for (const name of configNames) {
    if (installedNames.has(name)) {
      matched.push(name);
    } else {
      missing.push(name);
    }
  }

  const extra = [...installedNames].filter((name) => !configNames.has(name));

  return { isManagerInstalled: true, missing, extra, matched };
}
