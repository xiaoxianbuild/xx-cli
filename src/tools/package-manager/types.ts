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
  infoPackages(packageNames: string[]): Promise<PackageDetailInfo[]>;
  searchPackages(query: string): Promise<PackageListInfo>;
}

export interface PackageInfo {
  name: string;
  version?: string;
  description?: string;
  isInstalled?: boolean;
  tags?: string[];
  type?: string;
}

export interface PackageListInfo {
  manager: string;
  packages: PackageInfo[];
}

export interface PackageDetailInfo extends PackageInfo {
  manager: string;
  rawInfo?: string;
}

export interface BinaryPackageProcessor {
  name: string;
  check(): Promise<boolean>;
  install(): Promise<void>;
  upgrade(): Promise<void>;
  uninstall(): Promise<void>;
}
