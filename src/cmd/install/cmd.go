package install

import (
	"errors"
	"github.com/spf13/cobra"
	"github.com/xiaoxianbuild/xx-cli/src/tools/package_manager/asdf"
)

func installFunc(cmd *cobra.Command, args []string) error {
	if len(args) == 0 {
		cmd.Print(cmd.UsageString())
		return errors.New("install command should have at least one argument")
	}

	// Handle different install subcommands
	switch args[0] {
	case asdf.BinaryName:
		return asdf.Install(cmd)
	default:
		cmd.Println("install called, install packages:", args)
		return nil
	}
}

func NewCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:           "install",
		Short:         "install packages",
		RunE:          installFunc,
		SilenceErrors: true,
		SilenceUsage:  true,
	}
	return cmd
}
