build:
	browserify -t debowerify -t deamdify test/index.js -o test/bundle.js
