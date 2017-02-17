/*****
Karma is a popular test runner for JavaScript, it works with many other testing
libraries and frameworks such as Jasmine and Mocha.
*******/

// http://karma-runner.github.io/0.12/config/configuration-file.html

require('proxyquireify')(require);
//accepts one argument: the configuration object
module.exports = function (config) {
    'use strict';
    // Karma configuration
    config.set({
        
        //List of test frameworks you want to use.  (Typically jasmine/mocha/qunit/...)
        frameworks: ['browserify','jasmine-ajax', 'jasmine' ],

        /*
        The jasmine-ajax plugin overwrites the original XMLHttpRequest object, therefore,
        it's important to initialize the Ajax plugin before starting your test and
        restore the original object once your test is done.*/

        // list of files or patterns to load in the browser. The files array field tells
        //to Karma which files will be tested in the glob format
        files: ['spec/**/*[Ss]pec.js'],

        //  A map of preprocessors to use, Js loaded by the browserify
        // https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: { 
            'spec/**/*[Ss]pec.js': ['browserify']
        },

        // Cobfigure how to bundle the test files with Browserify
        browserify: {
            debug: true,
            //You should have proxyquireify to replace the original js file to load
            plugin: ['proxyquireify/plugin'],
            transform: ['jstify'],
            extensions: ['.js', '.tpl']
        },

        //A list of reporters to use.
        //the spec reporter and html-detailed-reporter are most used.
        //https://www.npmjs.com/package/karma-spec-reporter
        //https://www.npmjs.com/package/karma-html-detailed-reporter
        reporters: ['spec', 'htmlDetailed'],

        // configure the HTML-Detailed-Reporter to put all results in one file    
        htmlDetailed: {
            splitResults: false
        },

        // list of files or patterns to exclude
        exclude: [], //Default 

        //The port where the web server will be listening
        port: 9876, //Default

        // enable or disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values:  
        //LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO, //Default, Type: Constant
                
        /**
          A plugin can be a string or an inlined plugin - Object.
          By default, Karma loads all sibling NPM modules which have a name starting with
          karma-*. https://www.npmjs.com/browse/keyword/karma-plugin
        **/
        //List of plugins to load. 
        plugins: ['karma-*'],

        // Continuous Integration mode. if true, it capture browsers, run tests and exit
        singleRun: false,
                    
        // enable or disable watching file and executing tests whenever any file changes
        autoWatch: true,//Default

        //The configuration setting tells Karma how long to wait (in milliseconds) after
        //any changes have occurred before starting the test process again.
        autoWatchBatchDelay: 250,//Default

        // The root path location that will be used to resolve all relative paths defined in files and exclude.
        basePath: '',//Default

        //How long does Karma wait for a browser to reconnect (in ms)
        browserDisconnectTimeout: 2000, //Default

        //The number of disconnections tolerated.
        browserDisconnectTolerance: 0,//Default

        //How long will Karma wait for a message from a browser before disconnecting from
        //it(in ms)
        browserNoActivityTimeout: 10000, //Default

        // Start these browsers, currently available:
        // - Chrome (launcher requires karma-chrome-launcher plugin)
        // - ChromeCanary (launcher comes installed with Karma)
        // - PhantomJS (launcher requires karma-phantomjs-launcher plugin)
        // - Firefox (launcher requires karma-firefox-launcher plugin)
        // - Opera (launcher requires karma-opera-launcher plugin)
        // - Safari (only Mac)  (launcher requires karma-safari-launcher plugin)
        // - IE (only Windows)  (launcher requires karma-ie-launcher plugin)

        //A list of browsers to launch and capture
        browsers: ['Chrome'/*,'PhantomJS'*/], //Default: []

        //Timeout for capturing a browser (in ms)
        // If any browser does not get captured within the timeout, Karma will kill it 
        //and try to launch it again and, after three attempts to capture it, Karma will
        //give up
        captureTimeout: 60000, //Default

        //Hostname to be used when capturing browsers
        hostname: 'localhost', //Default
                
        // A map of path-proxy pairs
        proxies: {} //default
        /**
        Example:
            proxies: {
            '/static': 'http://gstatic.com',
            '/web': 'http://localhost:9000'
            },
        **/
    });
};