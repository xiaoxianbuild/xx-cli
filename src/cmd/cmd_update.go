package cmd

import (
	"errors"
	"github.com/google/go-github/v70/github"
	"github.com/minio/selfupdate"
	"github.com/spf13/cobra"
	"github.com/xiaoxianbuild/xx-cli/src/utils"
	"github.com/xiaoxianbuild/xx-cli/src/utils/github_utils"
	"github.com/xiaoxianbuild/xx-cli/src/utils/reflect_utils"
	"net/http"
	"net/url"
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

func checkUpdateArgsAndFlags(cmd *cobra.Command, args []string) (string, *http.Client, error) {
	if len(args) > 0 {
		_ = cmd.Usage()
		return "", nil, errors.New("update command does not accept any arguments")
	}
	if cmd.Flags().Changed(updateFlagGithub) && cmd.Flags().Changed(updateFlagCustom) {
		_ = cmd.Usage()
		return "", nil, errors.New("only one of --github or --custom can be specified")
	}
	githubFlag, _ := cmd.Flags().GetBool(updateFlagGithub)
	githubFlag = githubFlag && !cmd.Flags().Changed(updateFlagCustom)
	custom, _ := cmd.Flags().GetString(updateFlagCustom)
	proxy, _ := cmd.Flags().GetString(updateFlagProxy)
	httpClient, err := getHttpClient(proxy)
	if err != nil {
		return "", nil, err
	}
	if githubFlag {
		// get latest release from GitHub
		githubInfo, err := reflect_utils.GetGithubPackageInfo(empty{})
		if err != nil {
			return "", nil, err
		}
		githubReleaseUrl, err := github_utils.GetLatestReleaseBinary(
			cmd.Context(),
			github.NewClient(httpClient),
			githubInfo.RepoOwner, githubInfo.RepoName,
			nil,
		)
		if err != nil {
			return "", nil, err
		}
		return githubReleaseUrl, httpClient, nil
	}
	if custom == "" {
		return "", nil, errors.New("custom URL must be specified")
	}
	return custom, httpClient, nil
}

func updateFunc(cmd *cobra.Command, args []string) error {
	releaseUrl, httpClient, err := checkUpdateArgsAndFlags(cmd, args)
	if err != nil {
		return err
	}
	resp, err := httpClient.Get(releaseUrl)
	if err != nil {
		return err
	}
	defer utils.PanicIf(resp.Body.Close())
	err = selfupdate.Apply(resp.Body, selfupdate.Options{})
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
