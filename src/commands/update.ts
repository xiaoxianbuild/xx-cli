import { Command } from 'commander';
import { getLatestRelease, downloadAsset } from '../utils/github';
import { Version, CommandName } from '../constants';
import { compareVersions } from '../utils/version';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export function createUpdateCommand() {
  return new Command('update')
    .description('Update the CLI to the latest version')
    .option('--github', 'Update from GitHub', true)
    .option('-c, --custom <url>', 'Update from Custom URL')
    .option('-p, --proxy <url>', 'Proxy URL')
    .action(async (options) => {
      const { exePath, tempPath } = getExecutePath();
      if (!exePath) {
        console.error('Failed to get executable path');
        return;
      }

      try {
        const { isLatestVersion, downloadUrl, newVersion } = await getDownloadUrl(options);
        if (isLatestVersion) {
          console.log(`Current version ${Version} is up to date.`);
          return;
        }

        console.log(`Downloading update from ${downloadUrl}...`);
        const buffer = await downloadAsset(downloadUrl);

        console.log(`Writing downloaded binary to temporary file(${tempPath})...`);
        fs.writeFileSync(tempPath, Buffer.from(buffer));
        fs.chmodSync(tempPath, 0o755);

        // 原子替换
        console.log(`Replacing ${exePath} with ${tempPath}...`);
        fs.renameSync(tempPath, exePath);

        console.log(`Successfully updated ${CommandName} to ${newVersion}`);
      } catch (error) {
        console.error('Update failed:', (error as Error).message);
        process.exit(1);
      }
    });
}
function getExecutePath() {
  // 获取当前二进制的绝对路径
  // 在 Bun 编译的二进制中，process.execPath 指向二进制本身
  let exePath = process.execPath;

  // 如果是开发模式（直接用 bun 运行），则不执行替换逻辑
  if (path.basename(exePath) === 'bun' || path.basename(exePath) === 'bun-debug') {
    console.log('Running in development mode (via bun). Skipping self-replacement.');
    console.log('Downloaded new binary would be applied to:', exePath);
    return {};
  }

  try {
    exePath = fs.realpathSync(exePath);
  } catch (e) {
    // 如果无法获取真实路径，退而求其次使用原路径
  }

  const tempPath = exePath + '.tmp';

  console.log(`Applying update to: ${exePath}`);
  return { exePath, tempPath };
}

async function getDownloadUrl(options: any) {
  const owner = 'xiaoxianbuild';
  const repo = 'xx-cli';
  let downloadUrl = '';
  let newVersion = '';

  if (options.github) {
    console.log('Checking for updates on GitHub...');
    const release = await getLatestRelease(owner, repo);
    newVersion = release.tag_name;

    if (compareVersions(newVersion, Version) <= 0) {
      return { isLatestVersion: true, downloadUrl, newVersion };
    }

    console.log(`New version found: ${newVersion}, current version: ${Version}`);
    const platform = os.platform(); // linux, darwin
    const arch = os.arch() === 'x64' ? 'amd64' : process.arch; // amd64, arm64
    const binaryName = `${CommandName}_${platform}_${arch}`;

    const asset = release.assets.find((a) => a.name === binaryName);
    if (!asset) {
      throw new Error(`Failed to find binary ${binaryName} in release ${newVersion}`);
    }
    downloadUrl = asset.browser_download_url;
  } else if (options.custom) {
    downloadUrl = options.custom;
    newVersion = 'custom';
  } else {
    throw new Error('Either --github or --custom must be specified');
  }
  return { isLatestVersion: false, downloadUrl, newVersion };
}
