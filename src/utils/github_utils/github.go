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

func GetLatestReleaseBinary(
	ctx context.Context,
	client *github.Client,
	repoOwner, repoName string,
	assetMatcher AssetMatcher) (*int64, error) {
	release, _, err := client.Repositories.GetLatestRelease(ctx, repoOwner, repoName)
	if err != nil {
		return nil, err
	}

	if assetMatcher != nil {
		for _, asset := range release.Assets {
			if assetMatcher(asset) {
				return asset.ID, nil
			}
		}
	}
	return nil, ErrBinaryNotFound
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
