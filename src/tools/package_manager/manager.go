package package_manager

import (
	"errors"
	"github.com/xiaoxianbuild/xx-cli/src/types"
)

type PackageManager interface {
	Check() (bool, error) // check manager itself
	CheckPackage(packageName string) (bool, error)
	SupportPackage(packageName string) bool
	InstallPackage(logger types.Logger, packageName string) error
	UpgradePackage(logger types.Logger, packageName string) error
	UninstallPackage(logger types.Logger, packageName string) error
}

var PackagerManagers = []PackageManager{
	NewBinaryManager(),
	NewSystemPackageManager(),
}

func Install(logger types.Logger, packageName string) error {
	for _, manager := range PackagerManagers {
		if ok := manager.SupportPackage(packageName); !ok {
			continue
		}
		if err := manager.InstallPackage(logger, packageName); err != nil {
			logger.Println("install package error:", err)
			continue
		}
		return nil
	}
	logger.Println("install called, install packages:", packageName)
	return errors.New("does not support install this package")
}

func Upgrade(logger types.Logger, packageName string) error {
	for _, manager := range PackagerManagers {
		if ok := manager.SupportPackage(packageName); !ok {
			continue
		}
		if err := manager.UpgradePackage(logger, packageName); err != nil {
			logger.Println("upgrade package error:", err)
			continue
		}
		return nil
	}
	logger.Println("upgrade called, upgrade packages:", packageName)
	return errors.New("does not support upgrade this package")
}

func Uninstall(logger types.Logger, packageName string) error {
	for _, manager := range PackagerManagers {
		if ok := manager.SupportPackage(packageName); !ok {
			continue
		}
		if err := manager.UninstallPackage(logger, packageName); err != nil {
			logger.Println("uninstall package error:", err)
			continue
		}
		return nil
	}
	logger.Println("uninstall called, uninstall packages:", packageName)
	return errors.New("does not support uninstall this package")
}
