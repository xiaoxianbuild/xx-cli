import semver from "semver";

/**
 * 比较两个版本号。
 * 如果 v1 > v2 返回正数，v1 < v2 返回负数，相等返回 0。
 * 它会自动处理带有 'v' 前缀的版本号。
 */
export function compareVersions(v1: string, v2: string): number {
  const s1 = semver.clean(v1) || v1;
  const s2 = semver.clean(v2) || v2;

  if (semver.gt(s1, s2)) return 1;
  if (semver.lt(s1, s2)) return -1;
  return 0;
}

/**
 * 检查版本号是否有效。
 */
export function isValidVersion(v: string): boolean {
  return semver.valid(v) !== null;
}
