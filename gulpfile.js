var gulp = require('gulp');
var gutil = require('gulp-util');
var tsc = require('gulp-typescript');

var config = {
    dist: 'dist',
    src: 'src',
    src_ts: 'src/*.ts',
    errorHandler: function(title) {
        return function(err) {
            gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
            this.emit('end');
        };
    }
}

var tsProject = tsc.createProject({
    module: 'commonjs',
    target: 'ES5',
    sortOutput: true,
    removeComments: false,
    declarationFiles: false
});

gulp.task('typescript', function () {
    return gulp
        .src([config.src_ts])
        .pipe(tsc(tsProject))
        .on('error', config.errorHandler('TypeScript'))
        .js
        .pipe(gulp.dest(config.dist));
});

gulp.task('watch', function () {
    gulp.watch(['src/*.ts', 'typings/**/*.d.ts'], ['typescript']);
});

gulp.task('default', function () {
    gutil.log(gutil.colors.yellow('default task not implemented'));
});
