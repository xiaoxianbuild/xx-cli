package cmd

import (
	"errors"
	"github.com/spf13/cobra"
	"github.com/xiaoxianbuild/xx-cli/src/utils/system_utils"
)

const printEnvFlagRaw = "raw"
const printEnvFlagWithName = "with-name"
const printEnvFlagMulti = "multi"

func printEnvFunc(cmd *cobra.Command, args []string) error {
	if len(args) == 0 {
		cmd.Print(cmd.UsageString())
		return errors.New("print env command needs at least one argument")
	}
	raw, _ := cmd.Flags().GetBool(printEnvFlagRaw)
	withName, _ := cmd.Flags().GetBool(printEnvFlagWithName)
	multi, _ := cmd.Flags().GetBool(printEnvFlagMulti)
	if !multi && len(args) > 1 {
		cmd.Print(cmd.UsageString())
		return errors.New("print env command does not accept multiple arguments without --multi flag")
	}
	for _, name := range args {
		if withName {
			cmd.Printf("[%s]", name)
			cmd.Printf("\n")
		}
		if raw {
			cmd.Printf("%s\n", system_utils.GetEnvPrintString(name, nil))
		} else {
			cmd.Printf("%s\n", system_utils.GetEnvPrintString(name, &system_utils.EnvironmentSeparator))
		}
	}
	return nil
}

func addPrintEnvFlags(cmd *cobra.Command) {
	cmd.Flags().BoolP(printEnvFlagRaw, "r", false, "raw print")
	cmd.Flags().BoolP(printEnvFlagWithName, "n", false, "print with name")
	cmd.Flags().BoolP(printEnvFlagMulti, "m", false, "print with multi variables")
}

func newPrintEnvCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:           "env",
		Short:         "print env variable",
		RunE:          printEnvFunc,
		SilenceErrors: true,
		SilenceUsage:  true,
	}
	addPrintEnvFlags(cmd)
	return cmd
}

func newPrintCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:           "print",
		Short:         "print something",
		RunE:          printEnvFunc,
		SilenceErrors: true,
		SilenceUsage:  true,
	}
	cmd.AddCommand(
		newPrintEnvCommand(),
	)
	addPrintEnvFlags(cmd)
	return cmd
}
