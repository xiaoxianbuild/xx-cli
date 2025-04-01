package system_utils

import (
	"github.com/xiaoxianbuild/xx-cli/src/utils"
	"io"
	"os"
)

func MustMkdir(path string) {
	utils.PanicIfError(Mkdir(path))
}

// Mkdir creates a directory at the specified path.
func Mkdir(path string) error {
	if err := os.MkdirAll(path, 0755); err != nil {
		return err
	}
	return nil
}

func HasFile(path string) bool {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return false
	}
	return true
}

func WriteFile(path string, content string) {
	utils.PanicIfError(os.WriteFile(path, []byte(content), 0644))
}

func ReadFile(path string) string {
	return string(ReadFileBytes(path))
}

func ReadFileBytes(path string) []byte {
	file, err := os.Open(path)
	utils.PanicIfError(err)
	defer utils.PanicIfCloseError(file)
	data, err := io.ReadAll(file)
	utils.PanicIfError(err)
	return data
}
