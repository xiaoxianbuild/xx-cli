package reflect_utils

import (
	"errors"
	"reflect"
	"strings"
)

type GithubPackageInfo struct {
	RepoOwner           string
	RepoName            string
	packageRelativePath string
}

var (
	ErrNotGithubPackage         = errors.New("not a github package")
	ErrInvalidGithubPackagePath = errors.New("invalid github package path")
	ErrCouldNotGetPackageInfo   = errors.New("could not get package info from object")
)

func GetGithubPackageInfo(obj any) (*GithubPackageInfo, error) {
	if obj == nil {
		return nil, ErrCouldNotGetPackageInfo
	}
	fullPath := reflect.TypeOf(obj).PkgPath()
	if fullPath == "" {
		return nil, ErrCouldNotGetPackageInfo
	}
	if strings.HasPrefix(fullPath, "github.com/") {
		parts := strings.Split(fullPath, "/")
		if len(parts) < 3 {
			return nil, ErrInvalidGithubPackagePath
		}
		return &GithubPackageInfo{
			RepoOwner:           parts[1],
			RepoName:            parts[2],
			packageRelativePath: strings.Join(parts[3:], "/"),
		}, nil
	}
	return nil, ErrNotGithubPackage
}
