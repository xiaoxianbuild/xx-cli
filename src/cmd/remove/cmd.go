package remove

import (
	"errors"
	"github.com/spf13/cobra"
	"github.com/xiaoxianbuild/xx-cli/src/tools/package_manager/asdf"
)

func removeFunc(cmd *cobra.Command, args []string) error {
	if len(args) == 0 {
		cmd.Print(cmd.UsageString())
		return errors.New("remove command should have at least one argument")
	}

	// Handle different remove subcommands
	switch args[0] {
	case asdf.BinaryName:
		return asdf.Remove(cmd)
	default:
		cmd.Println("remove called, remove packages:", args)
		return nil
	}
}

func NewCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:           "remove",
		Short:         "remove packages",
		RunE:          removeFunc,
		SilenceErrors: true,
		SilenceUsage:  true,
	}
	return cmd
}
