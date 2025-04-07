package installer

type Package struct {
	Mac   string
	Linux string
}

var Packages = map[string]string{
	"python": "python3",
}
