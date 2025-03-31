package cmd

import (
	"context"
	"errors"
	"fmt"
	"github.com/google/go-github/v70/github"
	"github.com/minio/selfupdate"
	"github.com/spf13/cobra"
	"github.com/xiaoxianbuild/xx-cli/src/utils"
	"github.com/xiaoxianbuild/xx-cli/src/utils/github_utils"
	"github.com/xiaoxianbuild/xx-cli/src/utils/reflect_utils"
	"io"
	"net/http"
	"net/url"
	"runtime"
)

const updateFlagGithub = "github"
const updateFlagCustom = "custom"
const updateFlagProxy = "proxy"

type empty struct{}

func getHttpClient(proxy string) (*http.Client, error) {
	proxyFunc := http.ProxyFromEnvironment
	if proxy != "" {
		proxyUrl, err := url.Parse(proxy)
		if err != nil {
			return nil, err
		}
		proxyFunc = http.ProxyURL(proxyUrl)
	}
	return &http.Client{
		Transport: &http.Transport{
			Proxy: proxyFunc,
		},
	}, nil
}

func checkUpdateArgsAndFlags(cmd *cobra.Command, args []string) (bool, string, string, error) {
	if len(args) > 0 {
		cmd.Print(cmd.UsageString())
		return false, "", "", errors.New("update command does not accept any arguments")
	}
	if cmd.Flags().Changed(updateFlagGithub) && cmd.Flags().Changed(updateFlagCustom) {
		cmd.Print(cmd.UsageString())
		return false, "", "", errors.New("only one of --github or --custom can be specified")
	}
	githubFlag, _ := cmd.Flags().GetBool(updateFlagGithub)
	githubFlag = githubFlag && !cmd.Flags().Changed(updateFlagCustom)
	customFlag, _ := cmd.Flags().GetString(updateFlagCustom)
	proxyFlag, _ := cmd.Flags().GetString(updateFlagProxy)
	return githubFlag, customFlag, proxyFlag, nil
}

func fetchReleaseBinary(
	ctx context.Context,
	githubFlag bool,
	customFlag string,
	proxyFlag string,
) (io.ReadCloser, error) {
	httpClient, err := getHttpClient(proxyFlag)
	if err != nil {
		return nil, err
	}
	if githubFlag {
		// get latest release from GitHub
		githubInfo, err := reflect_utils.GetGithubPackageInfo(empty{})
		if err != nil {
			return nil, err
		}
		binaryName := fmt.Sprintf("%s_%s_%s", CommandName, runtime.GOOS, runtime.GOARCH)
		githubClient := github.NewClient(httpClient)
		githubAssetId, err := github_utils.GetLatestReleaseBinary(
			ctx,
			githubClient,
			githubInfo.RepoOwner, githubInfo.RepoName,
			func(asset *github.ReleaseAsset) bool {
				name := asset.GetName()
				return binaryName == name
			},
		)
		if err != nil {
			return nil, err
		}
		return github_utils.DownloadAsset(
			ctx,
			githubClient,
			githubInfo.RepoOwner, githubInfo.RepoName,
			githubAssetId,
			httpClient,
		)
	}
	if customFlag == "" {
		return nil, errors.New("custom URL must be specified")
	}
	resp, err := httpClient.Get(customFlag)
	if err != nil {
		return nil, err
	}
	return resp.Body, nil
}

func updateFunc(cmd *cobra.Command, args []string) error {
	githubFlag, customFlag, proxyFlag, err := checkUpdateArgsAndFlags(cmd, args)
	if err != nil {
		return err
	}
	resp, err := fetchReleaseBinary(cmd.Context(), githubFlag, customFlag, proxyFlag)
	if err != nil {
		return err
	}
	defer utils.PanicIfCloseError(resp)
	err = selfupdate.Apply(resp, selfupdate.Options{})
	if err != nil {
		return err
	}
	return err
}

func newUpdateCommand() *cobra.Command {
	updateCmd := &cobra.Command{
		Use:           "update",
		Short:         "Update the CLI",
		RunE:          updateFunc,
		SilenceErrors: true,
		SilenceUsage:  true,
	}
	updateCmd.Flags().Bool(updateFlagGithub, true, "Update from GitHub")
	updateCmd.Flags().StringP(updateFlagCustom, "c", "", "Update from Custom URL")
	updateCmd.Flags().StringP(updateFlagProxy, "p", "", "Proxy URL")
	return updateCmd
}
