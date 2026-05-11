import pc from 'picocolors';

export const color = {
  success: (text: string) => pc.green(text),
  error: (text: string) => pc.red(text),
  warning: (text: string) => pc.yellow(text),
  info: (text: string) => pc.blue(text),
  dim: (text: string) => pc.gray(text),
  bold: (text: string) => pc.bold(text),
  cyan: (text: string) => pc.cyan(text),
  yellow: (text: string) => pc.yellow(text),
  green: (text: string) => pc.green(text),
  gray: (text: string) => pc.gray(text),
  highlight: (text: string) => pc.bold(pc.cyan(text)),
};
