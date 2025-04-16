package version_utils

import (
	"github.com/Masterminds/semver/v3"
)

func Compare(version1 string, version2 string) (int, error) {
	v1, err := semver.NewVersion(version1)
	if err != nil {
		return 0, err
	}
	v2, err := semver.NewVersion(version2)
	if err != nil {
		return 0, err
	}
	return v1.Compare(v2), nil
}
