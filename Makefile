.PHONY: examples
EXAMPLES_DIR=examples

publish:
	@rm -f npm-debug.log && npm publish

unpublish:
	@for number in $$(seq 1 $$(cat package.json | grep version | sed 's/^.*\.//' | sed 's/\".*$$//')); do npm unpublish 0.0.$$number --force; done

build-examples:
	@find ./$(EXAMPLES_DIR)/* -maxdepth 0 -type d -exec bash -c "cd '{}' && npm run build" \;

clean-examples:
	@find ./$(EXAMPLES_DIR)/* -maxdepth 0 -type d -exec bash -c "cd '{}' && rm -rf build" \;
