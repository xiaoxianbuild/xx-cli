package github_utils

import (
	"context"
	"github.com/google/go-github/v70/github"
	"github.com/stretchr/testify/assert"
	"strings"
	"testing"
)

func TestGetLatestReleaseBinary(t *testing.T) {
	client := github.NewClient(nil)
	got, err := GetLatestReleaseBinary(context.Background(), client,
		"google", "go-github",
		nil,
	)
	assert.Error(t, err)
	assert.EqualError(t, err, ErrBinaryNotFound.Error())
	assert.Nil(t, got)

	got, err = GetLatestReleaseBinary(context.Background(), client,
		"asdf-vm", "asdf",
		func(asset *github.ReleaseAsset) bool {
			name := asset.GetName()
			return strings.HasSuffix(name, "darwin-amd64.tar.gz")
		},
	)
	assert.Nil(t, err)
	assert.NotNil(t, got)
}
