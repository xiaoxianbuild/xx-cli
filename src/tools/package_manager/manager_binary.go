package package_manager

import (
	"github.com/xiaoxianbuild/xx-cli/src/tools/package_manager/asdf"
	"github.com/xiaoxianbuild/xx-cli/src/types"
)

func NewBinaryManager() PackageManager {
	return &BinaryPackageManager{}
}

type BinaryPackageProcessor interface {
	Check() (bool, error)
	Install(logger types.Logger) error
	Upgrade(logger types.Logger) error
	Uninstall(logger types.Logger) error
}

var BinaryPackageTable = map[string]BinaryPackageProcessor{
	asdf.BinaryName: asdf.New(),
}

type BinaryPackageManager struct {
}

func (m BinaryPackageManager) Check() (bool, error) {
	// this m just installs binary, do not have any other requirement
	return true, nil
}

func (m BinaryPackageManager) CheckPackage(packageName string) (bool, error) {
	if processor, ok := BinaryPackageTable[packageName]; ok {
		return processor.Check()
	}
	return false, nil // TODO add error info
}

func (m BinaryPackageManager) SupportPackage(packageName string) bool {
	_, ok := BinaryPackageTable[packageName]
	return ok
}

func (m BinaryPackageManager) InstallPackage(logger types.Logger, packageName string) error {
	if processor, ok := BinaryPackageTable[packageName]; ok {
		return processor.Install(logger)
	}
	return nil // TODO add error info
}

func (m BinaryPackageManager) UpgradePackage(logger types.Logger, packageName string) error {
	if processor, ok := BinaryPackageTable[packageName]; ok {
		return processor.Upgrade(logger)
	}
	return nil // TODO add error info
}

func (m BinaryPackageManager) UninstallPackage(logger types.Logger, packageName string) error {
	if processor, ok := BinaryPackageTable[packageName]; ok {
		return processor.Uninstall(logger)
	}
	return nil // TODO add error info

}
