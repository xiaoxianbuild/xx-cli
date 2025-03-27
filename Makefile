.PHONY: build
build:
	@if [ "$(shell uname)" = "Darwin" ] && [ "$(shell uname -m)" = "arm64" ]; then \
	   	echo "Building for macOS with Apple silicon (arm64) architecture..."; \
	elif [ "$(shell uname)" = "Linux" ] && [ "$(shell uname -m)" = "x86_64" ]; then \
        echo "Building for Linux with AMD64 architecture..."; \
	else \
		echo "This script is only for macOS with Apple silicon (arm64) architecture."; \
		exit 1; \
	fi
	go build -o build/xx ./main.go
	@echo "Build completed successfully.";

.PHONY: clean
clean:
	@echo "Cleaning up build files..."
	rm -rf build/xx
	@echo "Cleaned up build files."
