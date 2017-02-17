//To configure the Gulp tasks, you will need to create a file called gulpfile.js that
//Gulp will read every time you run the gulp command. All Gulp tasks have a name and
//a function thai is executed when the task is invoked
'use strict'

var gulp = require('gulp');//引用类库，相当于.net中的using
var $ = require('gulp-load-plugins')();//这个插件能自动帮你加载package.json文件里的gulp插件

//The gulp-browserify plugin is currently deprecated and should not be used
var browserify = require('browserify');
var jstify = require('jstify');
var watchify = require('watchify');

//因为Gulp插件的输入必须是Buffer或Stream类型的Vinyl File Object。
//它们分别是具有不同功能的Stream转换模块。
//把普通的Node Stream转换为Vinyl File Object Stream. 
//Stream特性是可以把数据分成小块，一段一段地传输
var source = require('vinyl-source-stream');
//接收Vinyl File Object作为输入，然后判断其contents类型，如果是Stream就转换为Buffer
var buffer = require('vinyl-buffer');

//Browser Sync 帮助我们搭建简单的本地服务器并能实时刷新浏览器
var browserSync = require('browser-sync');
var httpProxy = require('http-proxy');

//Transform the ECMAScript 6 code into JavaScript
var babelify = require('babelify');
//Support ES2015
var es2005 = require('babel-preset-es2015');
//Support react
var react = require('babel-preset-react');

/********
Development environment
********/

gulp.task('serve', ['browserify', 'express'], function () {
    var serverProxy = httpProxy.createProxyServer();
    browserSync({
        port: 9000,
        ui: { port: 9001 },
        server: {
            baseDir: ['app'],
            middleware: [
                function (req, res, next) {
                    if (req.url.match(/^\/(api|avatar)\/.*/)) {
                        serverProxy.web(req, res, {
                            target: 'http://localhost:3000'
                        });
                    }else {
                        next();
                    }
                }
            ]
        }
    });
    gulp.watch([
        'app/**/*.html',
        'app/**/*.js',
        'app/**/*.css'
    ]).on('change', browserSync.reload);
});

// Bundle files with browserify
gulp.task('browserify', function () {
    // set up the browserify instance on a task basis
    var bundler = browserify({
        entries: 'app/js/main.js',
        //When opts.debug is true, add a source map inline to the end of the bundle.
        debug: true,
        //the Browserify jstify transformation to compile the underscore templates
        transform: [jstify]
    });

    bundler = watchify(bundler);
    //Bundle the files and their dependencies into a single javascript file.
    var rebundle = function () {
        return bundler.bundle()
            .on('error', $.util.log)
            //using vinyl-source-stream to stream the files to the bundler
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe($.sourcemaps.init({ loadMaps: true }))
            //Add transformation tasks to the pipeline here.
            .on('error', $.util.log)
            .pipe($.sourcemaps.write('./'))
            //write the output in the app/js path.
            .pipe(gulp.dest('app/js'));
    }
    bundler.on('update', rebundle);
    return rebundle();

});

gulp.task('express', function () {
    //nodemon will watch all of files for changes and restart node server 
    //if it detects any.replacing node with nodemon in your command
    $.nodemon({
        script: './bin/www',
        ext: 'js html',
        env: {
            'NODE_ENV': 'development'
        },
        ignore: ['app']
    });
});

/********
Production workflow
********/

//Processes HTML files to concatenate JavaScript and CSS assets into a single file
gulp.task('html', function () {
    
    var assets = $.useref.assets();
    return gulp.src('app/*.html')
        //Concatenate all the assets that are found in the HTML files and puts them 
        //in a stream
        .pipe(assets)
        //minify javsScript files
        .pipe($.if('*.js', uglify()))
        //minif CSS files
        .pipe($.if('*.css', minifyCss()))
        //restore the original stream of HTML files
        .pipe(assets.restore())
        //parse HTML file to replace the assets files in a single HTML tag
        .pipe($.useref())
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
    gulp.src('app/*/*.{jpg, gif, svg, png}')
        .pipe($.imagemin())
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
    return gulp.src([
        'app/{,styles/}fonts/**/*',
        'node_modules/bootstrap/dist/fonts/**/*'
    ])
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'));
});

// Bundle files with browserify for production
gulp.task('browserify:dist', function () {
    // set up the browserify instance on a task basis
    var bundler = browserify({
        entries: 'app/js/main.js',
        // defining transforms here will avoid crashing your stream
        transform: [babelify, jstify]
    });
    return bundler.bundle()
        .on('error', $.util.log)
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js'));
});

//build application product
gulp.task('serve:dist', ['browserify:dist', 'images', 'fonts',
    'express'], function() {
        var serverProxy = httpProxy.createProxyServer();
        browserSync({
            port: 9000,
            ui: {
                port: 9001
            },
            server: {
                baseDir: 'dist',
                middleware: [
                    function (req, res, next) {
                        if (req.url.match(/^\/(api|avatar)\/.*/)) {
                            serverProxy.web(req, res, {
                                target: 'http://localhost:3000'
                            });
                        } else {
                            next();
                        }
                    }
                ]
            }
        });
    });

/**********
Test
***********/

gulp.task('test', ['expressTest', 'karmaTest']);

gulp.task('expressTest', $.shell.task('node ./bin/www'));

gulp.task('karmaTest', $.shell.task('powershell -command "./karma.ps1"'));
