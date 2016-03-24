NODE_BIN=./node_modules/.bin

all: build

build: node_modules
	$(NODE_BIN)/uglifyjs index.js -c -m -o ./dist/tout-js-sdk-embed-code.min.js

clean:
	rm -r ./node_modules

node_modules: package.json
	npm install

