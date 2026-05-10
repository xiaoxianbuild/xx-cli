package doctor

import (
	"errors"
	"github.com/spf13/cobra"
	"runtime"
)

func doctorFunc(cmd *cobra.Command, args []string) error {
	if len(args) != 0 {
		cmd.Print(cmd.UsageString())
		return errors.New("init command does not accept any arguments")
	}
	cmd.Println("doctor called, check your computer environment")
	cmd.Println("1. check your system:", runtime.GOOS, runtime.GOARCH)
	return nil
}

func NewCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:           "doctor",
		Short:         "doctor check xiaoxian cli environment",
		RunE:          doctorFunc,
		SilenceErrors: true,
		SilenceUsage:  true,
	}
	return cmd
}
