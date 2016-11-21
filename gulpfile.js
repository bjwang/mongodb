var gulp = require('gulp');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var jadeify = require('jadeify');
var stripDebug = require('gulp-strip-debug');
var concat = require('gulp-concat');

var paths = {
	styl: [
		'src/styl/pure.css',
		'src/styl/app.styl'
	],
	lib: [
    'src/lib/jquery-1.11.3.js',
    'src/lib/modal.js',
    'src/lib/unslider.js',
    'src/lib/jquery.validate.js'
	]
};

gulp.task('stylus', function(){
	gulp.src(paths.styl)
		.pipe(stylus({
			compress: true,
			url: {
				name: 'url',
				limit: 10000,
				paths: ['static']
			}
		}))
		.pipe(concat('app.css'))
		.pipe(gulp.dest('./static/css'));
});

gulp.task('stylus-dev', function () {
  gulp.src(paths.styl)
    .pipe(stylus({
      linenos: true,
      url: {
        name: 'url',
        limit: 10000,
        paths: ['static']
      }
    }))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./static/css'));
});

gulp.task('js', function(){
  var src = 'src/js/index.js';
  var dest = 'static/js/app.js';
  var b = browserify({
    entries: src,
    transform: [jadeify],
    debug: false
  });

  return b.bundle()
    .pipe(source(dest))
    .pipe(buffer())
    .pipe(stripDebug())
      .pipe(uglify())
      .on('error', gutil.log)
    .pipe(gulp.dest('./'));
});

// build browserify
gulp.task('js-dev', function(){
  var src = 'src/js/index.js';
  var dest = 'static/js/app.js';
  var b = browserify({
    entries: src,
    transform: [jadeify],
    debug: true
  });

  return b.bundle()
    .pipe(source(dest))
    .pipe(buffer())
      .on('error', gutil.log)
    .pipe(gulp.dest('./'));
});

// build lib
gulp.task('lib', function(){
  // web lib
  gulp.src(paths.lib)
    .pipe(uglify())
    .pipe(concat('lib.js'))
  .pipe(gulp.dest('static/js'));
});

gulp.task('watch', function() {
  gulp.watch(['src/**/*.styl','static/img/*'], ['stylus-dev']);
  gulp.watch(['src/lib/*'], ['js-dev', 'lib']);
  gulp.watch(['src/js/**/*.*', 'tpl/*.pug'], ['js-dev']);
});

gulp.task('build', ['stylus', 'js', 'lib']);

gulp.task('default', ['stylus', 'js', 'lib']);
