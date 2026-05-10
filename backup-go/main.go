package main

import (
	"context"
	"github.com/spf13/cobra"
	"github.com/xiaoxianbuild/xx-cli/src/cmd"
)

func main() {
	cobra.CheckErr(cmd.NewCLI().ExecuteContext(context.Background()))
}
