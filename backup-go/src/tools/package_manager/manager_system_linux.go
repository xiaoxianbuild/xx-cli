//go:build linux

package package_manager

import "github.com/xiaoxianbuild/xx-cli/src/types"

func NewSystemPackageManager() PackageManager {
	return &DebianPackageManager{}
}

type DebianPackageManager struct {
}

func (m DebianPackageManager) SupportPackage(packageName string) bool {
	//TODO implement me
	panic("implement me")
}

func (m DebianPackageManager) Check() (bool, error) {
	//TODO implement me
	panic("implement me")
}

func (m DebianPackageManager) CheckPackage(packageName string) (bool, error) {
	//TODO implement me
	panic("implement me")
}

func (m DebianPackageManager) InstallPackage(logger types.Logger, packageName string) error {
	//TODO implement me
	panic("implement me")
}

func (m DebianPackageManager) UpgradePackage(logger types.Logger, packageName string) error {
	//TODO implement me
	panic("implement me")
}

func (m DebianPackageManager) UninstallPackage(logger types.Logger, packageName string) error {
	//TODO implement me
	panic("implement me")
}
