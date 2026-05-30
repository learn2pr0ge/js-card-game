install:
	npm install

build:
	rm -rf dist
	mkdir dist
	cp index.js dist/
	cp -r src dist/

docs:
	mkdir -p docs
	npm run documentation -- build src/index.js -f md > docs/README.md

test:
	npm test

lint:
	npx eslint .

publish:
	npm publish --access public

.PHONY: test
