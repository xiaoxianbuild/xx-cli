import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * 这个脚本用于执行真正的编译工作。
 * 它会读取环境变量，构造 bun build 命令并执行。
 */

const VERSION = process.env.VERSION || '0.0.1';
const COMMIT = process.env.COMMIT || 'local';
const BUILD_TIME = process.env.BUILD_TIME || new Date().toISOString();
const TARGET = process.env.TARGET || ''; // e.g. bun-linux-x64
const OUTFILE = process.env.OUTFILE || 'dist/xx';

console.log('Compiling with settings:');
console.log(`- Version: ${VERSION}`);
console.log(`- Commit: ${COMMIT}`);
console.log(`- BuildTime: ${BUILD_TIME}`);
console.log(`- Target: ${TARGET || 'native'}`);
console.log(`- Outfile: ${OUTFILE}`);

const outDir = path.dirname(OUTFILE);
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const args = [
  'build',
  'src/index.ts',
  '--compile',
  '--target=bun', // 基础目标是 bun
  '--define',
  `process.env.VERSION='${VERSION}'`,
  '--define',
  `process.env.BUILD_TIME='${BUILD_TIME}'`,
  '--define',
  `process.env.COMMIT='${COMMIT}'`,
  '--outfile',
  OUTFILE,
];

// 如果指定了特定 target (如 bun-linux-arm64)
if (TARGET) {
  args.push('--target', TARGET);
}

const result = spawnSync('bun', args, { stdio: 'inherit' });

if (result.status !== 0) {
  console.error('Compilation failed');
  process.exit(result.status || 1);
}

console.log(`Compilation successful: ${OUTFILE}`);
