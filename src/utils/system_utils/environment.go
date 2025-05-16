package system_utils

import (
	"github.com/xiaoxianbuild/xx-cli/src/utils"
	"os"
	"os/exec"
	"path"
	"strings"
)

var EnvironmentSeparator = ':'

// CheckExecutableInPath checks if a exe file exists in the PATH
func CheckExecutableInPath(exe string) bool {
	_, err := exec.LookPath(exe)
	return err == nil
}

func GetEnvPrintString(key string, separate *rune) string {
	envVar := os.Getenv(key)
	if separate == nil {
		return envVar
	}
	return strings.Join(strings.Split(envVar, string(*separate)), "\n")
}

func Home() string {
	home, err := os.UserHomeDir()
	utils.PanicIfError(err)
	return home
}

func GetEnvWithDefault(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func XDGDataHome() string {
	return GetEnvWithDefault(
		"XDG_DATA_HOME",
		path.Join(Home(), ".local", "share"),
	)
}

func XDGStateHome() string {
	return GetEnvWithDefault(
		"XDG_STATE_HOME",
		path.Join(Home(), ".local", "state"),
	)
}

// XDGBinHome returns the path to the user's local bin directory
// according to the XDG Base Directory Specification
func XDGBinHome() string {
	return path.Join(Home(), ".local", "bin")
}

func XDGConfigHome() string {
	return GetEnvWithDefault(
		"XDG_CONFIG_HOME",
		path.Join(Home(), ".config"),
	)
}

func XDGCacheHome() string {
	return GetEnvWithDefault(
		"XDG_CACHE_HOME",
		path.Join(Home(), ".cache"),
	)
}
