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

This project is built using [Bun](https://bun.sh) and TypeScript.

### Prerequisites

Install Bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Build

To build the binary for your current platform:

```bash
bun run compile
```

The binary will be generated at `dist/xx`.

### Release

Releases are automatically built and published via GitHub Actions when a new tag `v*` is pushed. The workflow compiles the project into single binaries for multiple platforms (Linux, macOS) using Bun's `--compile` feature.
