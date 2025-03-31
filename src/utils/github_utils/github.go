package github_utils

import (
	"context"
	"errors"
	"github.com/google/go-github/v70/github"
)

type AssetMatcher = func(*github.ReleaseAsset) bool

var ErrBinaryNotFound = errors.New("could not find binary in the latest release")

func GetLatestReleaseBinary(
	ctx context.Context,
	client *github.Client,
	repoOwner, repoName string,
	assetMatcher AssetMatcher) (string, error) {
	release, _, err := client.Repositories.GetLatestRelease(ctx, repoOwner, repoName)
	if err != nil {
		return "", err
	}

	var assetURL string
	if assetMatcher != nil {
		for _, asset := range release.Assets {
			if assetMatcher(asset) {
				assetURL = asset.GetBrowserDownloadURL()
				return assetURL, nil
			}
		}
	}
	return "", ErrBinaryNotFound
}
