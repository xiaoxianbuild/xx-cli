export GO_VERSION := $(shell go env GOVERSION)
GO_RELEASER := $(shell go env GOBIN)/goreleaser
export GOOS := $(shell go env GOOS)
export GOARCH := $(shell go env GOARCH)
.PHONY: build
build:
	@if [ "$(GOOS)" = "darwin" ] && [ "$(GOARCH)" = "arm64" ]; then \
	   	echo "Building for macOS with Apple silicon (arm64) architecture..."; \
	elif [ "$(GOOS)" = "linux" ] && [ "$(GOARCH)" = "amd64" ]; then \
        echo "Building for Linux with AMD64 architecture..."; \
	else \
	  	echo "Unsupported platform($(GOOS) $(GOARCH))."; \
		exit 1; \
	fi
	$(GO_RELEASER) build --clean --snapshot --verbose --single-target
	cp dist/xx-cli_$(GOOS)_$(GOARCH)_*/xx-cli build/xx
	@echo "Build completed successfully.";

.PHONY: clean
clean:
	@echo "Cleaning up build files..."
	rm -rf build/xx
	@echo "Cleaned up build files."
