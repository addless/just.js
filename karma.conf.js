// Karma configuration
// Generated on Fri Aug 19 2016 16:29:11 GMT-0500 (CDT)

module.exports = function(config) {

    // this one is set to fallback to using the "standard" NODE_ENV
    var isCI = (process.env.BV_TEST_MODE === 'ci' || process.env.NODE_ENV === 'test');
    // these other modes use a custom environment variable so we can separate test mode from environment
    var isLocalFast = (process.env.BV_TEST_MODE === 'local-fast');
    var isLocalAll = (process.env.BV_TEST_MODE === 'local-all');
    var isLocalSeleniumGrid = (process.env.BV_TEST_MODE === 'local-sg');

    // make the browser list and other config different for different environments
    var browsers = ['PhantomJS'];
    var singleRun = false;

    if ( isCI ) {
        singleRun = true;
    } else if ( isLocalFast ) {
        // noop for now, defaults are good here
    } else if ( isLocalAll ) {
        browsers = ['Chrome','Firefox','PhantomJS'];
    } else if ( isLocalSeleniumGrid ) {
        // TODO: add this once local selenium grid is set up
    }

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
          'spec/*.js'
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: browsers,


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: singleRun,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        phantomjsLauncher: {
            // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
            exitOnResourceError: true
        }

    })
}
