package cli

import "os"

// RunWithSubCommand use jq with xx sub command.
func RunWithSubCommand() int {
	return (&cli{
		inStream:  os.Stdin,
		outStream: os.Stdout,
		errStream: os.Stderr,
	}).run(os.Args[2:])
}
