export GO_VERSION := $(shell go env GOVERSION)
export GOOS := $(shell go env GOOS)
export GOARCH := $(shell go env GOARCH)
GO_RELEASER := $(shell go env GOBIN)/goreleaser
PROJECT_NAME := xx

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
	cp dist/$(PROJECT_NAME)_$(GOOS)_$(GOARCH)_*/$(PROJECT_NAME) build/$(PROJECT_NAME)
	@echo "Build completed successfully.";

.PHONY: clean
clean:
	@echo "Cleaning up build files..."
	rm -rf build/$(PROJECT_NAME)
	@echo "Cleaned up build files."
