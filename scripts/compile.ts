/**
 * 这个脚本使用 Bun.build API 进行打包，并注入编译期常量。
 * 然后再调用 bun build --compile 将产物转换为二进制。
 */
import fs from 'node:fs';

// 1. 获取版本、时间、提交等信息
const BUILD_VERSION = process.env.VERSION || '0.0.1-dev';
const GIT_COMMIT = process.env.COMMIT || 'no-commit';
const BUILD_TIME = process.env.BUILD_TIME || new Date().toISOString();
const TARGET = process.env.TARGET || `bun-${process.platform}-${process.arch}`; // e.g. bun-linux-x64
const OUTFILE = process.env.OUTFILE || 'dist/xx';

console.log('Compiling with settings:');
console.log(`- Version: ${BUILD_VERSION}`);
console.log(`- Commit: ${GIT_COMMIT}`);
console.log(`- BuildTime: ${BUILD_TIME}`);
console.log(`- Target: ${TARGET || 'native'}`);
console.log(`- Outfile: ${OUTFILE}`);

// 2. 执行打包
// noinspection SpellCheckingInspection
const result = await Bun.build({
  entrypoints: ['./src/index.ts'],
  compile: {
    target: TARGET as Bun.Build.CompileTarget | undefined,
    outfile: OUTFILE,
  },
  minify: true,
  sourcemap: 'none',
  define: {
    BUILD_VERSION: JSON.stringify(BUILD_VERSION),
    BUILD_TIME: JSON.stringify(BUILD_TIME),
    GIT_COMMIT: JSON.stringify(GIT_COMMIT),
  },
});

// 注意要加上 "dot": true
const bunTmpGlob = new Bun.Glob('./*.bun-build');
for await (const file of bunTmpGlob.scan({ dot: true })) {
  console.log(`Removing temporary file: ${file}`);
  fs.rmSync(file, { force: true });
}

if (!result.success) {
  console.error('Compilation failed');
  for (const message of result.logs) {
    console.error(message);
  }
  process.exit(1);
}

console.log(`Compilation successful: ${OUTFILE}`);
