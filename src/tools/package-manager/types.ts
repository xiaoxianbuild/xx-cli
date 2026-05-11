export interface PackageManager {
  name: string;
  check(): Promise<boolean>;
  checkPackage(packageName: string): Promise<boolean>;
  supportsPackage(packageName: string): Promise<boolean>;
  installPackage(packageName: string): Promise<void>;
  upgradePackage(packageName: string): Promise<void>;
  uninstallPackage(packageName: string): Promise<void>;
  listPackages(): Promise<PackageListInfo>;
  infoPackage(packageName: string): Promise<PackageDetailInfo | null>;
}

export interface PackageInfo {
  name: string;
  version?: string;
  description?: string;
}

export interface PackageListInfo {
  manager: string;
  packages: PackageInfo[];
}

export interface PackageDetailInfo {
  manager: string;
  name: string;
  version?: string;
  description?: string;
  rawInfo?: string;
}

export interface BinaryPackageProcessor {
  name: string;
  check(): Promise<boolean>;
  install(): Promise<void>;
  upgrade(): Promise<void>;
  uninstall(): Promise<void>;
}
