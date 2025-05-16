# xiaoxian command line tool

## Installation

### Quick Install (macOS and Linux)

```bash
curl -fsSL https://raw.githubusercontent.com/xiaoxianbuild/xx-cli/main/install.sh | bash
```

This command downloads and executes the installation script, which:

- Detects your operating system and architecture
- Downloads the appropriate binary from the latest GitHub release
- Installs it to ~/.local/bin
- Makes it executable
- Provides instructions if ~/.local/bin is not in your PATH

## Development

this project builds release by goreleaser

### install goreleaser

```bash
go install github.com/goreleaser/goreleaser/v2@latest
```

### build binary and use in docker

```bash
make ubuntu
```