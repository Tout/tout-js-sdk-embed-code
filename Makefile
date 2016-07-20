NODE_BIN=./node_modules/.bin

all: build generate_test_helper

build: node_modules
	$(NODE_BIN)/uglifyjs ./src/index.js -c -o ./dist/index.min.js
	$(NODE_BIN)/uglifyjs ./src/dfp.js -c -o ./dist/dfp.min.js
	$(NODE_BIN)/uglifyjs ./src/mapAsyncFetchApp.js -c -o ./dist/mapAsyncFetchApp.min.js

generate_test_helper:
	cat ./spec/support/helper_prefix.js ./dist/index.min.js ./spec/support/helper_suffix.js > ./spec/support/helper.js

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

