export const CommandName = 'xx';
export const CommandShortDesc = 'xiaoxian command line tool';

/**
 * 这些变量是在编译期通过 Bun.build 的 define 功能注入的。
 * 在打包后的代码中，这些标识符会被直接替换为常量字符串。
 */
declare var BUILD_VERSION: string;
declare var BUILD_TIME: string;
declare var GIT_COMMIT: string;

// 导出这些值供其他模块使用。
// 我们使用 typeof 检查来确保在非编译开发模式下也能正常运行（回退到 unknown）。
export const Version = typeof BUILD_VERSION !== 'undefined' ? BUILD_VERSION : 'unknown';
export const BuildTime = typeof BUILD_TIME !== 'undefined' ? BUILD_TIME : 'unknown';
export const Commit = typeof GIT_COMMIT !== 'undefined' ? GIT_COMMIT : 'unknown';
