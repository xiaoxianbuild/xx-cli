package config

import (
	_ "embed"
	"github.com/xiaoxianbuild/xx-cli/src/utils"
	"github.com/xiaoxianbuild/xx-cli/src/utils/system_utils"
	"gopkg.in/yaml.v3"
	"path"
	"sync"
)

//goland:noinspection GoNameStartsWithPackageName
var ConfigFile = path.Join(system_utils.XDGConfigHome(), "xiaoxian.yaml")

//go:embed config.sample.yaml
var SampleConfig string

type Config struct {
	Version string `yaml:"version"`
}

func InitConfig() {
	// Create the config directory if it doesn't exist
	system_utils.MustMkdir(system_utils.XDGConfigHome())

	// Create the config file if it doesn't exist
	if !system_utils.HasFile(ConfigFile) {
		system_utils.WriteFile(ConfigFile, SampleConfig)
	}
}

var (
	config *Config
	once   sync.Once
)

func Get() *Config {
	once.Do(func() {
		config = &Config{}
		data := system_utils.ReadFileBytes(ConfigFile)
		utils.PanicIfError(yaml.Unmarshal(data, config))
	})
	return config
}
