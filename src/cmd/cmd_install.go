package cmd

import (
	"errors"
	"github.com/spf13/cobra"
)

func installFunc(cmd *cobra.Command, args []string) error {
	if len(args) == 0 {
		cmd.Print(cmd.UsageString())
		return errors.New("install command should have at least one argument")
	}
	cmd.Println("install called, install packages:", args)
	return nil
}

func newInstallCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:           "install",
		Short:         "install packages",
		RunE:          installFunc,
		SilenceErrors: true,
		SilenceUsage:  true,
	}
	return cmd
}
