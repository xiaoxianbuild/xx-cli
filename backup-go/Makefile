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

.PHONY: ubuntu
ubuntu:
	GOOS=linux GOARCH=amd64 SYSTEM=ubuntu DOCKER_VERSION=24.04 DIST_VERSION=v1 make single_build

.PHONY: ubuntu-arm
ubuntu-arm:
	GOOS=linux GOARCH=arm64 SYSTEM=ubuntu DOCKER_VERSION=noble DIST_VERSION=v8.0 make single_build

.PHONY: single_build
single_build:
	@echo "Building $(SYSTEM) $(GOARCH) xiaoxian tool"
	$(GO_RELEASER) build --clean --snapshot --single-target
	@echo "run $(SYSTEM) $(GOARCH)..."
	@docker run --rm -it \
		--platform $(GOOS)/$(GOARCH) \
		-v $(shell pwd)/dist/$(PROJECT_NAME)_$(GOOS)_$(GOARCH)_$(DIST_VERSION)/$(PROJECT_NAME):/usr/local/bin/$(PROJECT_NAME) \
		--name $(PROJECT_NAME)_$(SYSTEM)_$(GOARCH) \
		$(SYSTEM):$(DOCKER_VERSION)