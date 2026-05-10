export const CommandName = 'xx';
export const CommandShortDesc = 'xiaoxian command line tool';

/**
 * 以下变量会在编译期通过 Bun 的 --define 功能进行内联替换。
 * 编译后的二进制文件中这些将是硬编码的字符串常量。
 */
export const Version = process.env.VERSION || '0.0.1';
export const BuildTime = process.env.BUILD_TIME || new Date().toISOString();
export const Commit = process.env.COMMIT || 'unknown';
