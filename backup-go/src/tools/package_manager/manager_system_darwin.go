//go:build darwin

package package_manager

import "github.com/xiaoxianbuild/xx-cli/src/types"

func NewSystemPackageManager() PackageManager {
	return &MacOSPackageManager{}
}

type MacOSPackageManager struct {
}

func (m MacOSPackageManager) SupportPackage(packageName string) bool {
	//TODO implement me
	panic("implement me")
}

func (m MacOSPackageManager) Check() (bool, error) {
	//TODO implement me
	panic("implement me")
}

func (m MacOSPackageManager) CheckPackage(packageName string) (bool, error) {
	//TODO implement me
	panic("implement me")
}

func (m MacOSPackageManager) InstallPackage(logger types.Logger, packageName string) error {
	//TODO implement me
	panic("implement me")
}

func (m MacOSPackageManager) UpgradePackage(logger types.Logger, packageName string) error {
	//TODO implement me
	panic("implement me")
}

func (m MacOSPackageManager) UninstallPackage(logger types.Logger, packageName string) error {
	//TODO implement me
	panic("implement me")
}
