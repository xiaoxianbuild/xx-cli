import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { BrewPackageManager } from './brew';

describe('BrewPackageManager', () => {
  let manager: BrewPackageManager;
  const existedPackage = 'trash';
  const simplePackage = 'hello';
  const nonExistedPackage = 'python';

  beforeEach(() => {
    manager = new BrewPackageManager();
  });

  afterEach(() => {});

  it('should have the correct name', () => {
    expect(manager.name).toBe('brew');
  });

  it('check() should return true if brew is in path', async () => {
    expect(await manager.check()).toBe(true);
  });

  // noinspection SpellCheckingInspection
  it('supportsPackage should return true on darwin or linux', async () => {
    // noinspection SpellCheckingInspection
    Object.defineProperty(process, 'platform', { value: 'darwin', configurable: true });
    expect(await manager.supportsPackage(existedPackage)).toBe(true);

    // noinspection SpellCheckingInspection
    Object.defineProperty(process, 'platform', { value: 'linux', configurable: true });
    expect(await manager.supportsPackage(existedPackage)).toBe(true);

    Object.defineProperty(process, 'platform', { value: 'win32', configurable: true });
    expect(await manager.supportsPackage(existedPackage)).toBe(false);
  });

  it('checkPackage should return true if brew list succeeds', async () => {
    expect(await manager.checkPackage(existedPackage)).toBe(true);
  });

  it('checkPackage should return false if brew list fails', async () => {
    expect(await manager.checkPackage(nonExistedPackage)).toBe(false);
  });

  it('installPackage should call brew install and throw if it fails', async () => {
    expect(manager.installPackage(existedPackage)).rejects.toThrow(
      `Package ${existedPackage} already installed, skipping installation...`,
    );
  });

  it(
    'installPackage should call brew install and succeeds',
    async () => {
      await manager.installPackage(simplePackage);
      await manager.uninstallPackage(simplePackage);
    },
    {
      timeout: 10000,
    },
  );
});
