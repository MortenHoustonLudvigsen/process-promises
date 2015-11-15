/// <binding AfterBuild='dist' Clean='clean' />

var gulp = require('gulp');
var gutil = require('gulp-util');
var rimraf = require('gulp-rimraf');
var jasmine = require('gulp-jasmine');
var Q = require('q');
var resolve = require('resolve');
var split = require('split');
var spawn = require('child_process').spawn;

function tsc(projectDir) {
    function locateTsc() {
        var deferred = Q.defer();

        resolve('typescript/lib/tsc', { basedir: __dirname }, function (err, res) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(res);
            }
        });

        return deferred.promise;
    }

    function promiseTsc(tscPath) {
        var deferred = Q.defer();
        var childProcess = spawn('node', [tscPath, '-p', projectDir]);

        childProcess.stdout.pipe(split()).on('data', function (line) {
            if (line) gutil.log(line);
        });

        childProcess.stderr.pipe(split()).on('data', function (line) {
            if (line) gutil.log('Error: ' + line);
        });

        childProcess.on('error', function (err) {
            deferred.reject(err);
        });

        childProcess.on('close', function (exitCode){
            deferred.resolve(exitCode);
        });

        return deferred.promise;
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

gulp.task('test', ['compile:test'], function () {
    return gulp.src('build/test/**/*.js')
        .pipe(jasmine());
});

gulp.task('dist', ['test'], function () {
    return gulp
        .src([moduleLib + '/**/*', '!**/*.map'])
        .pipe(gulp.dest('lib'));
});



gulp.task('default', ['dist']);