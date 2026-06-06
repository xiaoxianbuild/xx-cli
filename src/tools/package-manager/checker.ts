import { $ } from 'bun';
import { managers } from './manager.ts';

export interface PackageManagerDiffResult {
  /** brew 是否已安装 */
  isManagerInstalled: boolean;
  /** 配置中声明但系统未安装的包 */
  missing: string[];
  /** 系统已安装但配置中未声明的包（已排除 matched 包的依赖） */
  extra: string[];
  /** 配置中声明且系统已安装的包 */
  matched: string[];
}

/**
 * 使用 `brew deps --union` 一次性获取多个包的所有递归依赖合集。
 */
async function getBrewDepsUnion(packageNames: string[]): Promise<Set<string>> {
  if (packageNames.length === 0) return new Set();

  const result = await $`brew deps --union ${packageNames}`.quiet().nothrow();
  if (result.exitCode !== 0) {
    return new Set();
  }
  const deps = result.stdout
    .toString()
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');
  return new Set(deps);
}

/**
 * 对比配置中声明的 brew 包与系统实际安装的 brew 包，返回差异结果。
 * extra 中会排除 matched 包的依赖，避免将自动安装的依赖标记为多余。
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

  // 获取所有 matched 包的依赖，从 extra 中排除
  const matchedDeps = await getBrewDepsUnion(matched);

  const extra = [...installedNames].filter((name) => !configNames.has(name) && !matchedDeps.has(name));

  return { isManagerInstalled: true, missing, extra, matched };
}
