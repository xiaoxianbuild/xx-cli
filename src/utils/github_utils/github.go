package github_utils

import (
	"context"
	"errors"
	"github.com/google/go-github/v70/github"
	"io"
	"net/http"
)

type AssetMatcher = func(*github.ReleaseAsset) bool

var ErrBinaryNotFound = errors.New("could not find binary in the latest release")

func GetVersionFromRelease(release *github.RepositoryRelease) string {
	if release != nil && release.TagName != nil {
		return *release.TagName
	}
	return ""
}

func GetLatestReleaseBinary(
	ctx context.Context,
	client *github.Client,
	repoOwner, repoName string,
	assetMatcher AssetMatcher) (*int64, string, error) {
	release, _, err := client.Repositories.GetLatestRelease(ctx, repoOwner, repoName)
	version := GetVersionFromRelease(release)
	if err != nil {
		return nil, version, err
	}

	if assetMatcher != nil {
		for _, asset := range release.Assets {
			if assetMatcher(asset) {
				return asset.ID, version, nil
			}
		}
	}
	return nil, version, ErrBinaryNotFound
}

// DownloadAsset downloads a release asset or returns a redirect URL.
//
// DownloadReleaseAsset returns an io.ReadCloser that reads the contents of the
// specified release asset. It is the caller's responsibility to close the ReadCloser.
func DownloadAsset(
	ctx context.Context,
	client *github.Client,
	repoOwner, repoName string,
	assetId *int64,
	httpClient *http.Client,
) (io.ReadCloser, error) {
	resp, _, err := client.Repositories.DownloadReleaseAsset(
		ctx, repoOwner, repoName,
		*assetId,
		httpClient,
	)
	return resp, err
}
