package package_manager

type PackageManager interface {
	Check() error
}

func NewPackageManager() PackageManager {
	return newPackageManager()
}
