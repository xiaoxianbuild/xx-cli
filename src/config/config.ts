import path from 'node:path';
import { getXDGConfigHome, mustMkdir, hasFile, writeFile, readFile } from '../utils/system';
import { type Config, ConfigSchema } from './types.ts';

const configPath = path.join(getXDGConfigHome(), 'xiaoxian');
const configFileName = 'xx.json';
export const ConfigFile = path.join(configPath, configFileName);

/** 获取默认配置（所有字段使用 schema 默认值） */
export function getDefaultConfig(): Config {
  return ConfigSchema.parse({});
}

export interface ConfigDiff {
  added: { key: string; value: unknown }[];
  removed: { key: string; value: unknown }[];
  changed: { key: string; oldValue: unknown; newValue: unknown }[];
}

/**
 * 对比两个配置对象的差异，返回 added / removed / changed。
 * 使用扁平化的 dot-notation key 进行深度比较。
 */
export function diffConfig(existing: Config, defaults: Config): ConfigDiff {
  const existingFlat = flattenObject(existing);
  const defaultFlat = flattenObject(defaults);

  const allKeys = new Set([...Object.keys(existingFlat), ...Object.keys(defaultFlat)]);
  const diff: ConfigDiff = { added: [], removed: [], changed: [] };

  for (const key of allKeys) {
    const inExisting = key in existingFlat;
    const inDefault = key in defaultFlat;

    if (inDefault && !inExisting) {
      // 默认配置有但现有配置没有 → 需要新增
      diff.added.push({ key, value: defaultFlat[key] });
    } else if (inExisting && !inDefault) {
      // 现有配置有但默认配置没有 → 多余的字段
      diff.removed.push({ key, value: existingFlat[key] });
    } else if (inExisting && inDefault) {
      const oldVal = JSON.stringify(existingFlat[key]);
      const newVal = JSON.stringify(defaultFlat[key]);
      if (oldVal !== newVal) {
        diff.changed.push({ key, oldValue: existingFlat[key], newValue: defaultFlat[key] });
      }
    }
  }

  return diff;
}

/**
 * 将嵌套对象扁平化为 dot-notation 的 key-value 对。
 * 数组会被保留为值，不会进一步展开。
 */
function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = value;
    }
  }

  return result;
}

export function initConfig(): ConfigDiff | null {
  mustMkdir(configPath);

  if (!hasFile(ConfigFile)) {
    const sampleConfig = getDefaultConfig();
    const sampleConfigString = JSON.stringify(sampleConfig, null, 2);
    writeFile(ConfigFile, sampleConfigString + '\n');
    return null; // 新创建，无差异
  }

  // 配置文件已存在，对比差异
  const existing = getConfig();
  const defaults = getDefaultConfig();
  return diffConfig(existing, defaults);
}

export function getConfig(): Config {
  const data = readFile(ConfigFile);
  const obj = JSON.parse(data);
  return ConfigSchema.parse(obj);
}
