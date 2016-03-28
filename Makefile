NODE_BIN=./node_modules/.bin

all: build generate_test_helper generate_docs

build: node_modules
	$(NODE_BIN)/uglifyjs ./src/index.js -c -m -o ./dist/tout-js-sdk-embed-code.min.js

generate_test_helper:
	cat ./spec/support/helper_prefix.txt ./dist/tout-js-sdk-embed-code.min.js ./spec/support/helper_suffix.txt > ./spec/support/helper.js

generate_docs:
	./bin/generate_readme.sh

lint:
	$(NODE_BIN)/eslint test/ src/

test: lint
	$(NODE_BIN)/karma start --single-run

# We want linting for tests, but while debugging it can be annoying.
# So this exists so I don't forget to restore the lint requirement to test.
test-nolint:
	$(NODE_BIN)/karma start --single-run

clean:
	rm -r ./node_modules

node_modules: package.json
	npm install

