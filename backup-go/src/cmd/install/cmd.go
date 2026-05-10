package install

import (
	"errors"
	"github.com/spf13/cobra"
	"github.com/xiaoxianbuild/xx-cli/src/tools/package_manager"
)

const UpgradeFlagName = "upgrade"

func installFunc(cmd *cobra.Command, args []string) error {
	if len(args) == 0 {
		cmd.Print(cmd.UsageString())
		return errors.New("install command should have at least one argument")
	}
	if upgrade, _ := cmd.Flags().GetBool(UpgradeFlagName); upgrade {
		return package_manager.Upgrade(cmd, args[0])
	}
	return package_manager.Install(cmd, args[0])
}

func NewCommand() *cobra.Command {
	cmd := &cobra.Command{
		Aliases:       []string{"add"},
		Use:           "install",
		Short:         "install packages",
		RunE:          installFunc,
		SilenceErrors: true,
		SilenceUsage:  true,
	}
	cmd.Flags().BoolP(UpgradeFlagName, "u", false, "upgrade packages")
	return cmd
}
