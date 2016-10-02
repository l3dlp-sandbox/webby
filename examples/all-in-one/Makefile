.PHONY: build

all: build

clean:
	@rm -rf build

build:
	@../../src/bin/webby.js build --source "src" --destination "build" --paths "lib-external"

server:
	@../../src/bin/webby.js server --home "build"
