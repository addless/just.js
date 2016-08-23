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

### Refactor the example files to work with your application

* You should not need to change ajax.js or just.js at all.
* Add one or more data sources to data.js using the Just.use() method. The object you pass to use() defines an "alias" for this data source, which will be available to the bind() method.
* Update get.js to call Just.get() for one or more data sources. Assuming you are requesting data from a server end point, you will most likely use .as(remoteResource). You should not need to change the private method remoteResource()
* Update bind.js to meet your needs. The basic functionality of this library is to:
	* Loop over the data referenced in the bind() method
	* Duplicate all DOM nodes found with the selector in the to() method
	* If you chain on the .as() method and pass it a handler with arguments key and object, each record in the data set will be made available to be used to manipulate the DOM node being duplicated. Your handler should return a function that accepts the current element as its only argument, within that method you can mutate the DOM node however you need to.

## Development

Of course start by cloning this repository to your workstation. You will need Node.js and a system install of PhantomJS to run the basic tests. Other than that, most of the dependencies are the usual local node_modules.

### Setup

1. Install [node.js v4.4.3](https://nodejs.org/ "node.js")
2. Install the necessary dependencies by running in the shell: `npm install`
3. Install phantomjs  
	On Mac OSX with homebrew: `brew install phantomjs`  
	On Windows, follow instructions here: `http://phantomjs.org/download.html`  
4. Install Chrome and Firefox locally to use the command `npm run test:local-all`
5. Install Docker and run `docker-compose up -d` to use the command `npm run test:local-selenium-grid`

### Testing `npm test:dev`

The most useful command for local development is to run `npm test:dev`, this will start PhantomJS locally and watch the library files and your test specs. Tests will be re-run whenever a file changes.

### Useful links, tips and documentation

#### Karma
[karma-runner.github.io](https://karma-runner.github.io)  

Karma is a test runner, and its claim to fame is that it allows you to "Test on Real Devices." This is implemented using various "launchers" that allow you to run your assertions in actual browsers against a real DOM and whatever version of the browser API is implemented in the targeted environment. At the moment, we are set up to run Karma tests locally against headless PhantomJS, and against a desktop installation of Chrome or Firefox. We've also set up the launcher for WebdriverIO which can connect to Selenium Grid, although this is mostly to "prove we can do it." Something like Selenium Grid is one of our possible paths to testing many more browsers.

It is crucial to note, that Karma's model is definitely focused on unit testing and testing Javascript DOM manipulation against a portion of a page, as opposed to testing an entire page web page. The configuration file tells Karma what script tags to include in the test page, and we have tooling set up to inject "fixtures" (small pieces of HTML) into the Karma generated test page's DOM to test and assert on DOM manipulation. This is appropriate for testing a library, but might not be the best fit for testing entire screens or applications.

#### Jasmine
[jasmine.github.io](http://jasmine.github.io)  

Jasmine is our current choice for assertion library. The code in the spec folder is all Jasmine. Their documentation is pretty good, and we have some sample tests started, so not much more to say about that here.

#### jasmine-ajax
[jasmine-ajax](https://github.com/jasmine/jasmine-ajax)  

OK, I lied, there are a few more interesting things to say. Ideally, this type of testing should be entirely "hermetic" meaning there is no actual I/O for things like XHR requests in our tests. This is a benefit for speed, and also makes the tests more amenable to running in many different environments like CI servers. The good folks at Jasmine have a solution for that, a fully featured mock of XMLHttpRequest.

This was an additional dependency we've had to add to the project, you can see it in our `package.json` and in the files array in `karma.conf.js`. We do not have any magic in place to **prevent** you from writing tests that invoke an actual XHR request, but it is highly recommended that you do not. There is a good example of how to do this in `spec/js/ajax_spec.js`.

#### jasmine.clock
[Mocking_the_JavaScript_Timeout_Functions](http://jasmine.github.io/2.0/introduction.html#section-Mocking_the_JavaScript_Timeout_Functions)  

A related difficulty is testing code that involves browser API calls to setTimeout(). Once again, the Jasmine team is on the case. As it turns out, there is an integral part of the Just.js render cycle that does indeed use setTimout and friends to debounce the render cycle. This feature is built in to Jasmine 2.x, so no additional dependency is needed. The mock does need to be installed/uninstalled from within a given spec, and the clock manipulated to jump ahead in time to make your tests easier to write. There is an example of this in `spec/js/just_spec.js`.

#### karma-html2js-preprocessor
[karma-html2js-preprocessor](https://github.com/karma-runner/karma-html2js-preprocessor)  

Since one of the primary features of Just.js involves DOM manipulation, we need some DOM to manipulate if we are going to test it thoroughly. Back to the big point about Karma (by default, your tests run in an empty web page generated by the framework) we need a way to inject HTML fixtures for individual tests. There are many more complicated ways to do this, but enabling a preprocessor that uses the html2js library is the simplest. The handling of this is essentially "built in" to Karma.

The pattern here is that **all** files with the `.html` extension that you put in the folder spec/fixtures will be available to your tests. You can access them as Javascript strings, on the browser global object `__html__`, with the relative path to the file as the key. Wow, that is a mouthful. There is an example of this in the `spec/js/just_spec.js` test for the `bind()` method. Remember, these are meant to be partials, you will be injecting them somewhere in a magical empty web page generated by Karma. Your fixtures should **not** contain script tags, or really anything with a src attribute, since that would involve I/O. _The current configuration is intentionally a little brittle in that PhantomJS will appear to crash if it encounters a 404 trying to load an external resource._

Keeping to the Just.js philosophy of minimal dependencies and leaning heavily on the native browser API, the tests will just retrieve the string, and set it as the innerHTML of document.body. There are many other dependencies we could accept in order to make this more elegant, but for now let's see how far as can get keeping things in in the tests as native as possible.

### NPM script reference

* `npm test` meant for CI, does a single run using local PhantomJS
* `npm run test:local-fast` meant for live use while developing, uses local PhantomJS and watches files for changes
* `npm run test:local-all` runs PhantomJS, Chrome and Firefox locally, watches files
* `npm run test:local-selenium-grid` runs Chrome and Firefox in the local Docker Selenium Grid instance, watches files
* `npm run test:dev` alias for `npm run test:local-fast`
* `npm run test:lsg` alias for `npm run test:local-selenium-grid`
