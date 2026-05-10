package uninstall

import (
	"errors"
	"github.com/spf13/cobra"
	"github.com/xiaoxianbuild/xx-cli/src/tools/package_manager"
)

func uninstallFunc(cmd *cobra.Command, args []string) error {
	if len(args) == 0 {
		cmd.Print(cmd.UsageString())
		return errors.New("uninstall command should have at least one argument")
	}

	return package_manager.Uninstall(cmd, args[0])
}

func NewCommand() *cobra.Command {
	cmd := &cobra.Command{
		Aliases:       []string{"remove"},
		Use:           "uninstall",
		Short:         "uninstall packages",
		RunE:          uninstallFunc,
		SilenceErrors: true,
		SilenceUsage:  true,
	}
	return cmd
}
