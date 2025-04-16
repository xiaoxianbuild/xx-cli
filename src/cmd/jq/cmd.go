package jq

import (
	"github.com/spf13/cobra"
	"github.com/xiaoxianbuild/xx-cli/src/cmd/jq/cli"
	"os"
)

func jqFunc(cmd *cobra.Command, args []string) error {
	run := cli.RunWithSubCommand()
	if run > 0 {
		os.Exit(run)
	}
	return nil
}

func NewCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:           "jq",
		Short:         "json tool provided by https://github.com/itchyny/gojq",
		RunE:          jqFunc,
		SilenceErrors: true,
		SilenceUsage:  true,
	}
	return cmd
}
