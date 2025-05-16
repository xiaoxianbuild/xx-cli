#!/bin/bash
set -e

# GitHub repository information
REPO_OWNER="xiaoxianbuild"
REPO_NAME="xx-cli"
BINARY_NAME="xx"

# Detect OS and architecture
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

# Map architecture to Go architecture naming
if [ "$ARCH" = "x86_64" ]; then
  ARCH="amd64"
elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
  ARCH="arm64"
else
  echo "Unsupported architecture: $ARCH"
  exit 1
fi

# Only support macOS and Linux
if [ "$OS" != "darwin" ] && [ "$OS" != "linux" ]; then
  echo "Unsupported operating system: $OS"
  exit 1
fi

# Create installation directory if it doesn't exist
INSTALL_DIR="$HOME/.local/bin"
mkdir -p "$INSTALL_DIR"

echo "Detected OS: $OS, Architecture: $ARCH"
echo "Installing $BINARY_NAME to $INSTALL_DIR..."

# Get the latest release information
LATEST_RELEASE_URL="https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/releases/latest"
echo "Fetching latest release information from $LATEST_RELEASE_URL..."

ASSET_NAME="${BINARY_NAME}_${OS}_${ARCH}"
DOWNLOAD_URL=$(curl -s "$LATEST_RELEASE_URL" | grep "browser_download_url.*$ASSET_NAME" | cut -d '"' -f 4)

if [ -z "$DOWNLOAD_URL" ]; then
  echo "Could not find binary for $OS $ARCH in the latest release"
  exit 1
fi

echo "Downloading from $DOWNLOAD_URL..."
curl -L "$DOWNLOAD_URL" -o "$INSTALL_DIR/$BINARY_NAME"
chmod +x "$INSTALL_DIR/$BINARY_NAME"

echo "$BINARY_NAME has been installed to $INSTALL_DIR/$BINARY_NAME"

# Check if the installation directory is in PATH
if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
  echo ""
  echo "NOTE: $INSTALL_DIR is not in your PATH."
  echo "To add it, run one of the following commands based on your shell:"
  echo ""
  echo "For Bash:"
  echo "  echo 'export PATH=\"\$HOME/.local/bin:\$PATH\"' >> ~/.bashrc && source ~/.bashrc"
  echo ""
  echo "For Zsh:"
  echo "  echo 'export PATH=\"\$HOME/.local/bin:\$PATH\"' >> ~/.zshrc && source ~/.zshrc"
  echo ""
  echo "For Fish:"
  echo "  fish -c 'set -U fish_user_paths \$HOME/.local/bin \$fish_user_paths'"
fi

echo ""
echo "Installation complete! You can now use the '$BINARY_NAME' command."