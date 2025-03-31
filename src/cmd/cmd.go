package cmd

import (
	"github.com/spf13/cobra"
	"github.com/xiaoxianbuild/xx-cli/src/constants"
	"log"
)

func NewCLI() *cobra.Command {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	cobra.EnableCommandSorting = false

	rootCmd := &cobra.Command{
		Use:     CommandName,
		Short:   CommandShortDesc,
		Version: constants.Version,
		CompletionOptions: cobra.CompletionOptions{
			DisableDefaultCmd: true,
		},
		Run: func(cmd *cobra.Command, args []string) {
			cmd.Print(cmd.UsageString())
		},
	}
	rootCmd.AddCommand(
		newUpdateCommand(),
		newPrintCommand(),
		newVersionCommand(),
	)

	return rootCmd
}
