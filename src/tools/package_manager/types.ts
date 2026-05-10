export interface PackageManager {
  name: string;
  check(): Promise<boolean>;
  checkPackage(packageName: string): Promise<boolean>;
  supportsPackage(packageName: string): boolean;
  installPackage(packageName: string): Promise<void>;
  upgradePackage(packageName: string): Promise<void>;
  uninstallPackage(packageName: string): Promise<void>;
}

export interface PackageProcessor {
  name: string;
  check(): Promise<boolean>;
  install(): Promise<void>;
  upgrade(): Promise<void>;
  uninstall(): Promise<void>;
}
