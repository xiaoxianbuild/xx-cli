package upgrade

import (
	"errors"
	"github.com/spf13/cobra"
	"github.com/xiaoxianbuild/xx-cli/src/tools/package_manager/asdf"
)

func upgradeFunc(cmd *cobra.Command, args []string) error {
	if len(args) == 0 {
		cmd.Print(cmd.UsageString())
		return errors.New("upgrade command should have at least one argument")
	}

	// Handle different upgrade subcommands
	switch args[0] {
	case asdf.BinaryName:
		return asdf.Upgrade(cmd)
	default:
		cmd.Println("upgrade called, upgrade packages:", args)
		return nil
	}
}

func NewCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:           "upgrade",
		Short:         "upgrade packages",
		RunE:          upgradeFunc,
		SilenceErrors: true,
		SilenceUsage:  true,
	}
	return cmd
}
