package system_utils

import (
	"os"
	"strings"
)

var EnvironmentSeparator = ':'

func GetEnv(key string, separate *rune) string {
	envVar := os.Getenv(key)
	if separate == nil {
		return envVar
	}
	return strings.Join(strings.Split(envVar, string(*separate)), "\n")
}
