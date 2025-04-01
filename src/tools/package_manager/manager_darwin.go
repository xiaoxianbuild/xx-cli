//go:build darwin

package package_manager

func newPackageManager() PackageManager {
	return &MacOSPackageManager{}
}

type MacOSPackageManager struct {
}

func (m MacOSPackageManager) Check() error {
	//TODO implement me
	panic("implement me")
}
