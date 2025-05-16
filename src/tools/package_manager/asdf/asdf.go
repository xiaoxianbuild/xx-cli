package asdf

import (
	"context"
	"crypto/tls"
	"fmt"
	"github.com/google/go-github/v70/github"
	"github.com/xiaoxianbuild/xx-cli/src/types"
	"github.com/xiaoxianbuild/xx-cli/src/utils"
	"github.com/xiaoxianbuild/xx-cli/src/utils/github_utils"
	"github.com/xiaoxianbuild/xx-cli/src/utils/system_utils"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path"
	"path/filepath"
	"runtime"
	"strings"
)

const BinaryName = "asdf"

const githubRepoOwner = "asdf-vm"
const githubRepoName = "asdf"

// Install installs the asdf version manager
func Install(logger types.Logger) error {
	// Check if asdf is already in PATH
	if system_utils.CheckExecutableInPath(BinaryName) {
		logger.Println("asdf is already installed and available in PATH")
		return nil
	}

	logger.Println("asdf not found in PATH, downloading latest release...")

	// Create a GitHub client with TLS verification disabled
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	httpClient := &http.Client{Transport: tr}
	githubClient := github.NewClient(httpClient)

	// Get the latest release binary
	logger.Println(fmt.Sprintf("Looking for asdf release for %s-%s", runtime.GOOS, runtime.GOARCH))
	assetId, version, err := github_utils.GetLatestReleaseBinary(
		context.Background(),
		githubClient,
		githubRepoOwner, githubRepoName,
		func(asset *github.ReleaseAsset) bool {
			name := asset.GetName()
			// Match the pattern: asdf-v0.16.7-darwin-amd64.tar.gz
			// Check if the name starts with "asdf-v" and contains the OS and architecture
			return strings.HasPrefix(name, "asdf-v") &&
				strings.Contains(name, fmt.Sprintf("-%s-%s.tar.gz", runtime.GOOS, runtime.GOARCH))
		},
	)

	if err != nil {
		return fmt.Errorf("failed to get latest asdf release: %v", err)
	}

	logger.Printf("Found asdf version %s\n", version)

	// Download the asset
	resp, err := github_utils.DownloadAsset(
		context.Background(),
		githubClient,
		githubRepoOwner, githubRepoName,
		assetId,
		httpClient,
	)

	if err != nil {
		return fmt.Errorf("failed to download asdf: %v", err)
	}
	defer utils.PanicIfCloseError(resp)

	// Create a temporary directory to extract the tarball
	tempDir, err := os.MkdirTemp("", "asdf-install")
	if err != nil {
		return fmt.Errorf("failed to create temporary directory: %v", err)
	}
	defer func() {
		utils.PanicIfError(os.RemoveAll(tempDir))
	}()

	// Save the tarball to the temporary directory
	tarballPath := filepath.Join(tempDir, "asdf.tar.gz")
	tarballFile, err := os.Create(tarballPath)
	if err != nil {
		return fmt.Errorf("failed to create tarball file: %v", err)
	}

	_, err = io.Copy(tarballFile, resp)
	utils.PanicIfError(tarballFile.Close())
	if err != nil {
		return fmt.Errorf("failed to save tarball: %v", err)
	}

	// Extract the tarball
	logger.Println("Extracting asdf...")
	extractCmd := exec.Command("tar", "-xzf", tarballPath, "-C", tempDir)
	if err := extractCmd.Run(); err != nil {
		return fmt.Errorf("failed to extract tarball: %v", err)
	}

	// Install asdf to ~/.local/bin according to XDG specification
	binPathDir := system_utils.XDGBinHome()

	// Create the bin directory if it doesn't exist
	if err := os.MkdirAll(binPathDir, 0755); err != nil {
		return fmt.Errorf("failed to create bin directory: %v", err)
	}

	// Find the asdf binary in the extracted files
	asdfBinaryPath := path.Join(tempDir, BinaryName)

	// Copy only the asdf binary to the bin directory
	binPath := filepath.Join(binPathDir, BinaryName)
	copyCmd := exec.Command("cp", asdfBinaryPath, binPath)
	if err := copyCmd.Run(); err != nil {
		return fmt.Errorf("failed to copy asdf binary: %v", err)
	}

	// Make the binary executable
	if err := os.Chmod(binPath, 0755); err != nil {
		return fmt.Errorf("failed to make asdf binary executable: %v", err)
	}

	logger.Printf("asdf %s has been installed to %s\n", version, binPath)
	logger.Println("Make sure that ~/.local/bin is in your PATH environment variable.")
	logger.Println("You can add it by adding the following to your shell configuration:")
	logger.Println("  export PATH=\"$HOME/.local/bin:$PATH\"")

	return nil
}
