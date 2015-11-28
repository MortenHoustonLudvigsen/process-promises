/// <binding AfterBuild='dist' Clean='clean' />

var gulp = require('gulp');
var gutil = require('gulp-util');
var rimraf = require('gulp-rimraf');
var jasmine = require('gulp-jasmine');
var Promise = require('bluebird');
var _resolve = require('resolve');
var split = require('split');
var spawn = require('child_process').spawn;

function tsc(projectDir) {
    function locateTsc() {
        return new Promise(function (resolve, reject) {
            _resolve('typescript/lib/tsc.js', { basedir: __dirname }, function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    gutil.log('resolved tsc: ' + res);
                    resolve(res);
                }
            });
        });
    }

    function promiseTsc(tscPath) {
        gutil.log('tsc: ' + tscPath);
        return new Promise(function (resolve, reject) {
            var childProcess = spawn('node', [tscPath, '-p', projectDir]);

            childProcess.stdout.pipe(split()).on('data', function (line) {
                if (line) gutil.log(line);
            });

            childProcess.stderr.pipe(split()).on('data', function (line) {
                if (line) gutil.log('Error: ' + line);
            });

            childProcess.on('error', function (err) {
                reject(err);
            });

            childProcess.on('close', function (exitCode) {
                resolve(exitCode);
            });
        });
    }

    return locateTsc().then(promiseTsc);
};

var modulePath = 'node_modules/process-promises';
var moduleLib = modulePath + '/lib';

gulp.task('clean', function () {
    var src = [];
    src.push(modulePath);
    src.push('build');
    src.push('lib');
    return gulp.src(src).pipe(rimraf());
});

gulp.task('init', ['clean'], function () {
    return gulp.src('package.json').pipe(gulp.dest(modulePath));
});

gulp.task('compile', ['init'], function () {
    return tsc('src');
});

gulp.task('compile:test', ['compile'], function () {
    return tsc('test');
});

gulp.task('copy:test', ['compile:test'], function () {
    return gulp
        .src(['test/**/*.js', 'test/**/*.json'])
        .pipe(gulp.dest('build/test'));
});

gulp.task('test', ['compile:test', 'copy:test'], function () {
    return gulp.src('build/test/specs/**/*.js')
        .pipe(jasmine({ verbose: true }));
});

gulp.task('dist', ['test'], function () {
    return gulp
        .src([moduleLib + '/**/*', '!**/*.map'])
        .pipe(gulp.dest('lib'));
});



gulp.task('default', ['dist']);