var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    path         = require('path'),
    cleanCSS     = require('gulp-minify-css'),
    minify       = require('gulp-minifier'),
    autoprefixer = require('gulp-autoprefixer'),
    watch        = require('gulp-watch'),
    rimraf       = require('gulp-rimraf'),
    concat       = require('gulp-concat'),
    browserify   = require('browserify'),
    babelify     = require('babelify'),
    source       = require('vinyl-source-stream'),
    buffer       = require('vinyl-buffer'),
    reactify     = require('reactify'),
    babel        = require('gulp-babel'),
    notify       = require('gulp-notify'),
    history      = require('connect-history-api-fallback'),
    getMessage   = require('./gulp-notifications');

var tasks = [
    'clean:js',
    'build:html',
    'build:css',
    'build:js'
];

gulp.task('clean:js', function() {
    return gulp.src('./public/js/**/*.js', { read: false })
        .pipe(rimraf());
});

gulp.task('build:html', function() {
    return gulp.src('./js/views/**/*.hbs')
        .on('error', notify.onError(function (error) {
            return getMessage('HTML', error);
        }))
        .pipe(gulp.dest('./public/hbs'));
});

gulp.task('build:css', function() {
    var fileType = 'CSS';

    return gulp.src('./scss/**/*.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .on('error', notify.onError(function (error) {
            return getMessage('CSS', error);
        }))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(notify(getMessage('CSS')))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('build:js', ['clean:js'], function(cb) {
    var fileType = 'JSX';

    return browserify('./js/app.jsx', {
            debug: true
        })
        .transform(babelify, {
            presets: [
                'es2015',
                'react'
            ],
            plugins: [
                'transform-class-properties'
            ]
        })
        .bundle()
        .on('error', notify.onError(function (error) {
            return getMessage('JSX', error);
        }))
        .pipe(source('app.js'))
        .pipe(buffer())
        // .pipe(minify({
        //     minify: true,
        //     collapseWhitespace: true,
        //     conservativeCollapse: true,
        //     minifyJS: true
        // }))
        .pipe(gulp.dest('./public/js'))
        .pipe(notify(getMessage('JSX')));
});

gulp.task('watch', tasks, function() {
    var http        = require('http');
    var connect     = require('connect');
    var serveStatic = require('serve-static');
    var open        = require('open');

    var port = 5319;
    var app  = connect()
        .use(history())
        .use(serveStatic(__dirname));

    // TODO: use gulp-watch AND gulp-plumber (for errors)
    gulp.watch('./scss/**/*.scss', [ 'build:css' ], { verbose: true });
    gulp.watch([ './js/**/*.js', './js/**/*.jsx' ], [ 'clean:js', 'build:js' ]);
    gulp.watch('./js/views/**/*.hbs', [ 'build:html' ]);

    /*
     * RUN:
     *  `$ stamplay start`
     */

    // http.createServer(app).listen(port, function () {
    //     open('http://localhost:' + port);
    //     notify(getMessage('server'));
    // });
});

gulp.task('default', tasks);
