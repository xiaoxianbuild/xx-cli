package cmd

import (
	"github.com/spf13/cobra"
	"github.com/xiaoxianbuild/xx-cli/src/constants"
)

func versionFunc(cmd *cobra.Command, _ []string) error {
	cmd.Printf(`Version: %s
BuildTime: %s
Commit: %s
GoVersion: %s
`, constants.Version, constants.BuildTime, constants.Commit, constants.GoVersion)
	return nil
}

func newVersionCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:           "version",
		Short:         "version of the CLI",
		SilenceErrors: true,
		SilenceUsage:  true,
		RunE:          versionFunc,
	}
	return cmd
}
