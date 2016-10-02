EXAMPLES_DIR=examples

publish:
	@rm -f npm-debug.log && npm publish

unpublish:
	@for number in $$(seq 1 $$(cat package.json | grep version | sed 's/^.*\.//' | sed 's/\".*$$//')); do npm unpublish 0.0.$$number --force; done

clean-examples:
	@find ./$(EXAMPLES_DIR)/* -maxdepth 0 -type d -exec bash -c "cd '{}' && make clean" \;

build-examples:
	@find ./$(EXAMPLES_DIR)/* -maxdepth 0 -type d -not -exec bash -c "cd '{}' && make" \; -quit

rebuild-examples: clean-examples build-examples

status:
	@echo "Lines total:"
	@echo "  - src: $(shell cat src/*.js src/bin/*.js | egrep -v "^$$" | egrep -v "^\s*\/\/" | wc -l | sed "s/ //g")"
	@echo "  - src (with comments): $(shell cat src/*.js src/bin/*.js | egrep -v "^$$" | wc -l | sed "s/ //g")"
	@echo "  - src (with comments and empty lines): $(shell cat src/*.js src/bin/*.js | wc -l | sed "s/ //g")"
