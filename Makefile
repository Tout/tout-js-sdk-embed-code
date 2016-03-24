NODE_BIN=./node_modules/.bin

all: build

build: node_modules
	$(NODE_BIN)/uglifyjs ./src/index.js -c -m -o ./dist/tout-js-sdk-embed-code.min.js

lint:
	$(NODE_BIN)/eslint test/ src/

test: lint
	$(NODE_BIN)/mocha -R nyan

test-debug:
	$(NODE_BIN)/mocha --debug-brk

# We want linting for tests, but while debugging it can be annoying.
# So this exists so I don't forget to restore the lint requirement to test.
test-nolint:
	$(NODE_BIN)/mocha -R nyan

clean:
	rm -r ./node_modules

node_modules: package.json
	npm install

