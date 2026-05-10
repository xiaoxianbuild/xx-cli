import type { PackageProcessor } from '../types';
import { getLatestRelease, downloadAsset } from '../../../utils/github';
import { checkExecutableInPath, getBinHome, mustMkdir } from '../../../utils/system';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

export class AsdfProcessor implements PackageProcessor {
  name = 'asdf';
  private owner = 'asdf-vm';
  private repo = 'asdf';

  async check(): Promise<boolean> {
    return checkExecutableInPath('asdf');
  }

  async install(): Promise<void> {
    if (await this.check()) {
      throw new Error('asdf is already installed and available in PATH');
    }

    console.log('asdf not found in PATH, downloading latest release...');
    const release = await getLatestRelease(this.owner, this.repo);
    const platform = process.platform; // linux, darwin
    const arch = process.arch === 'x64' ? 'amd64' : process.arch; // amd64, arm64

    const asset = release.assets.find(
      (a) => a.name.startsWith('asdf-v') && a.name.includes(`-${platform}-${arch}.tar.gz`),
    );

    if (!asset) {
      throw new Error(`Failed to find asdf release for ${platform}-${arch}`);
    }

    console.log(`Found asdf version ${release.tag_name}`);
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'asdf-install-'));
    const tarPath = path.join(tempDir, 'asdf.tar.gz');

    try {
      const buffer = await downloadAsset(asset.browser_download_url);
      fs.writeFileSync(tarPath, Buffer.from(buffer));

      console.log('Extracting asdf...');
      spawnSync('tar', ['-xzf', tarPath, '-C', tempDir], { stdio: 'inherit' });

      const binHome = getBinHome();
      mustMkdir(binHome);

      const asdfBin = path.join(tempDir, 'asdf');
      const targetBin = path.join(binHome, 'asdf');

      fs.copyFileSync(asdfBin, targetBin);
      fs.chmodSync(targetBin, 0o755);

      console.log(`asdf ${release.tag_name} has been installed to ${targetBin}`);
      console.log('Make sure that ~/.local/bin is in your PATH environment variable.');
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }

  async upgrade(): Promise<void> {
    if (!(await this.check())) {
      throw new Error("asdf is not installed. Please install it first using 'xx install asdf'");
    }

    console.log('Upgrading asdf to the latest version...');
    const release = await getLatestRelease(this.owner, this.repo);

    const versionResult = spawnSync('asdf', ['--version'], { encoding: 'utf8' });
    if (versionResult.status === 0) {
      const currentVersion = versionResult.stdout.trim();
      console.log(`Current asdf version: ${currentVersion}`);
      if (currentVersion.includes(release.tag_name.replace('v', ''))) {
        console.log('asdf is already at the latest version');
        return;
      }
    }

    const platform = process.platform;
    const arch = process.arch === 'x64' ? 'amd64' : process.arch;

    const asset = release.assets.find(
      (a) => a.name.startsWith('asdf-v') && a.name.includes(`-${platform}-${arch}.tar.gz`),
    );

    if (!asset) {
      throw new Error(`Failed to find asdf release for ${platform}-${arch}`);
    }

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'asdf-upgrade-'));
    const tarPath = path.join(tempDir, 'asdf.tar.gz');

    try {
      const buffer = await downloadAsset(asset.browser_download_url);
      fs.writeFileSync(tarPath, Buffer.from(buffer));

      console.log('Extracting asdf...');
      spawnSync('tar', ['-xzf', tarPath, '-C', tempDir], { stdio: 'inherit' });

      const whichResult = spawnSync('which', ['asdf'], { encoding: 'utf8' });
      if (whichResult.status !== 0) {
        throw new Error('Failed to locate current asdf binary');
      }
      const currentBinPath = whichResult.stdout.trim();

      const asdfBin = path.join(tempDir, 'asdf');
      fs.copyFileSync(asdfBin, currentBinPath);
      fs.chmodSync(currentBinPath, 0o755);

      console.log(`asdf has been upgraded to version ${release.tag_name}`);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }

  async uninstall(): Promise<void> {
    if (!(await this.check())) {
      throw new Error('asdf is not installed. Cannot uninstall');
    }

    console.log('Removing asdf...');
    const whichResult = spawnSync('which', ['asdf'], { encoding: 'utf8' });
    if (whichResult.status === 0) {
      const binPath = whichResult.stdout.trim();
      fs.unlinkSync(binPath);
      console.log('asdf has been uninstalled successfully');
    }
  }
}
