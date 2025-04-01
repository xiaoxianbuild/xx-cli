package utils

import "io"

func PanicIfCloseError(closer io.Closer) {
	PanicIfError(closer.Close())
}

func PanicIfError(err error) {
	if err != nil {
		panic(err)
	}
}
