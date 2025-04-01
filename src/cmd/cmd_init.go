package cmd

import (
	"errors"
	"github.com/spf13/cobra"
	"github.com/xiaoxianbuild/xx-cli/src/config"
)

func initFunc(cmd *cobra.Command, args []string) error {
	if len(args) != 0 {
		cmd.Print(cmd.UsageString())
		return errors.New("init command does not accept any arguments")
	}
	config.InitConfig()
	cmd.Println("init called, config file is", config.ConfigFile)
	return nil
}

func newInitCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:           "init",
		Short:         "init xiaoxian cli",
		RunE:          initFunc,
		SilenceErrors: true,
		SilenceUsage:  true,
	}
	return cmd
}
