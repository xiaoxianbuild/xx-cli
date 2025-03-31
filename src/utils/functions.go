package utils

import "io"

func PanicIfCloseError(closer io.Closer) {
	err := closer.Close()
	if err != nil {
		panic(err)
	}
}
