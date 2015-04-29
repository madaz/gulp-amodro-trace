gulp-amodro
===============
A gulp plugin that wraps amodro-trace and extracts files as buffers for use in the gulp pipe.

Features
--------
- Extract all files for a given call tree (amd, commonjs)

How to install
--------------
```shell
npm install github:madaz/gulp-amodro-trace
```

Advanced Usage
--------------

Pass in main entry (that was precompiled output from TypeScript with sourcemaps) and bundle all files into a single file ready for requirejs AMD.

```javascript
var amodro = require('gulp-amodro-trace');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('task', function() {
  return gulp.src('main.js') // main.js is output from main.ts with sourcemaps
    .pipe(amodro())
    .pipe(sourcemaps.init({loadMaps:true}))
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('.')) // write unminified file
    .pipe(rename(function(path){
      path.extname = '.min.js'
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('.'));
});
```

TODO
----
* Allow for amodro-trace options to be be passed in
* Unit tests
