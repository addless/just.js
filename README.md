# just.js

## How to use just.js in 3...2...1...

### Install the library dependencies and example files

* Copy these into your project:
```
js/ajax.js
js/just.js
js/data.js
js/get.js
js/bind.js
```
* Add script tags to your HTML template in that same order:
```
<!-- include just.js library and applications files -->
<script src="js/ajax.js"></script>
<script src="js/just.js"></script>
<script src="js/data.js"></script>
<script src="js/get.js"></script>
<script src="js/bind.js"></script>
```

## Refactor the example files to work with your application
* You should not need to change ajax.js or just.js at all.
* Add one or more data sources to data.js using the Just.use() method. The object you pass to use() defines an "alias" for this data source, which will be available to the bind() method.
* Update get.js to call Just.get() for one or more data sources. Assuming you are requesting data from a server end point, you will most likely use .as(remoteResource). You should not need to change the private method remoteResource()
* Update bind.js to meet your needs. The basic functionality of this library is to:
	* Loop over the data referenced in the bind() method
	* Duplicate all DOM nodes found with the selector in the to() method
	* If you chain on the .as() method and pass it a handler with arguments key and object, each record in the data set will be made available to be used to manipulate the DOM node being duplicated. Your handler should return a function that accepts the current element as its only argument, within that method you can mutate the DOM node however you need to.

## Development

### Setup

1. Install [node.js v4.4.3](https://nodejs.org/ "node.js")
2. Install the necessary dependencies by running in the shell: `npm install`
3. Install phantomjs  
	On Mac OSX with homebrew: `brew install phantomjs`  
	On Windows, follow instructions here: `http://phantomjs.org/download.html`  
4. To use the command `npm run test:local-all` you will need to install Chrome and Firefox locally
5. To use the command `npm run test:local-selenium-grid` you will need to have Docker installed, and run `docker-compose up -d` before starting the tests

### Testing

Run `npm test:dev`
